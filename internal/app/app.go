package app

import (
	"context"
	"time"

	"fyne.io/fyne/v2"
	"fyne.io/fyne/v2/app"
	"fyne.io/fyne/v2/canvas"
	"fyne.io/fyne/v2/container"
	"fyne.io/fyne/v2/layout"
	"fyne.io/fyne/v2/widget"
)

type App struct {
	ctx    context.Context
	cancel context.CancelFunc

	fapp  fyne.App
	logo  fyne.Resource
	foods []*canvas.Image
}

func New(foods []fyne.Resource) *App {
	ctx, cancel := context.WithCancel(context.Background())
	a := &App{
		ctx:    ctx,
		cancel: cancel,

		fapp: app.New(),
	}
	// make foods
	a.foods = make([]*canvas.Image, len(foods))
	for i := range foods {
		img := canvas.NewImageFromResource(foods[i])
		img.SetMinSize(fyne.NewSize(100, 100))
		if i == 0 {
			img.Show()
		} else {
			img.Hide()
		}
		a.foods[i] = img
	}

	a.fapp = app.New()
	a.fapp.Settings().SetTheme(&gfanTheme{})
	a.fapp.Lifecycle().SetOnStopped(func() {
		a.cancel()
	})
	return a
}

func (a *App) Run() {
	w := a.fapp.NewWindow("今天吃什么选择器 - zznQ")
	w.SetMaster()
	w.Resize(fyne.NewSize(300, 200))

	imgCenter := container.NewCenter()
	for i := range a.foods {
		imgCenter.AddObject(a.foods[i])
	}

	var (
		tickTime time.Duration = time.Millisecond * 50
		btn      *widget.Button
		running  bool         = true
		ticker   *time.Ticker = time.NewTicker(tickTime)
	)

	go func(ctx context.Context) {
		var (
			i, pre int
			length int = len(a.foods)
		)
		for {
			select {
			case <-ctx.Done():
				return
			case <-ticker.C:
				// TODO
				imgCenter.Refresh()

				cur := i % length
				curImg := a.foods[cur]
				if curImg.Hidden {
					curImg.Show()
					curImg.Refresh()
				}

				preImg := a.foods[pre]
				if !preImg.Hidden {
					preImg.Hide()
					preImg.Refresh()
				}

				i++
				pre = cur
			}
		}
	}(a.ctx)

	btn = widget.NewButton("停止", func() {
		if running {
			ticker.Stop()
			btn.SetText("开始")
		} else {
			ticker.Reset(tickTime)
			btn.SetText("停止")
		}
		running = !running
	})

	w.SetContent(fyne.NewContainerWithLayout(layout.NewVBoxLayout(),
		container.NewCenter(widget.NewLabel("今天吃什么选择器")),
		imgCenter,
		container.NewCenter(btn),
	))

	w.Show()
	a.fapp.Run()
}
