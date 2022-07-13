package app

import (
	"image/color"

	"fyne.io/fyne/v2"
	"fyne.io/fyne/v2/theme"
)

var (
	defaultTheme = theme.LightTheme()
)

type gfanTheme struct{}

var _ fyne.Theme = (*gfanTheme)(nil)

func (*gfanTheme) Font(s fyne.TextStyle) fyne.Resource {
	if s.Monospace {
		return theme.DefaultTheme().Font(s)
	}
	if s.Bold {
		if s.Italic {
			return theme.DefaultTheme().Font(s)
		}
		return resourceAaZiTiGuanJiaZhiJiaoDai2Ttf
	}
	if s.Italic {
		return theme.DefaultTheme().Font(s)
	}
	return resourceAaZiTiGuanJiaZhiJiaoDai2Ttf
}

func (*gfanTheme) Color(n fyne.ThemeColorName, v fyne.ThemeVariant) color.Color {
	return defaultTheme.Color(n, v)
}

func (*gfanTheme) Icon(n fyne.ThemeIconName) fyne.Resource {
	return defaultTheme.Icon(n)
}

func (*gfanTheme) Size(n fyne.ThemeSizeName) float32 {
	return defaultTheme.Size(n)
}
