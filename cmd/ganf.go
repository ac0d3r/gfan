package main

import (
	"embed"
	"log"
	"path"

	"fyne.io/fyne/v2"
	"github.com/Buzz2d0/gfan/internal/app"
)

//go:embed foods
var foodsFS embed.FS

func main() {
	dirs, err := foodsFS.ReadDir("foods")
	if err != nil {
		panic(err)
	}

	foods := make([]fyne.Resource, 0)
	for _, dir := range dirs {
		if dir.IsDir() {
			continue
		}
		path := path.Join("foods", dir.Name())
		data, err := foodsFS.ReadFile(path)
		if err != nil {
			log.Printf("open file %s error: %v", path, err)
			continue
		}
		food := fyne.NewStaticResource(dir.Name(), data)
		foods = append(foods, food)
	}

	gfan := app.New(foods)
	gfan.Run()
}
