package main

import (
	"image"
	"image/color"
	"image/draw"
	"image/png"
	"os"
)

type circleMask struct {
	p image.Point
	r int
}

func (c *circleMask) ColorModel() color.Model {
	return color.AlphaModel
}

func (c *circleMask) Bounds() image.Rectangle {
	return image.Rect(c.p.X-c.r, c.p.Y-c.r, c.p.X+c.r, c.p.Y+c.r)
}

func (c *circleMask) At(x, y int) color.Color {
	xx, yy, rr := float64(x-c.p.X)+0.5, float64(y-c.p.Y)+0.5, float64(c.r)
	if xx*xx+yy*yy < rr*rr {
		return color.Alpha{255}
	}
	return color.Alpha{0}
}

func main() {
	file, err := os.Open("frontend/public/favicon.png")
	if err != nil {
		panic(err)
	}
	defer file.Close()

	img, err := png.Decode(file)
	if err != nil {
		panic(err)
	}

	bounds := img.Bounds()
	width := bounds.Dx()
	height := bounds.Dy()
	
	// Assume square based on smallest dimension
	side := width
	if height < side {
		side = height
	}
	radius := side / 2

	mask := &circleMask{image.Point{side / 2, side / 2}, radius}

	// Create a perfectly square bounds for the new image
	squareBounds := image.Rect(0, 0, side, side)
	result := image.NewRGBA(squareBounds)

	// Calculate offset to crop from the center of the original image
	offsetX := (width - side) / 2
	offsetY := (height - side) / 2
	srcPoint := image.Point{X: offsetX, Y: offsetY}

	draw.DrawMask(result, squareBounds, img, srcPoint, mask, image.Point{}, draw.Over)

	outFile, err := os.Create("frontend/public/favicon_circle.png")
	if err != nil {
		panic(err)
	}
	defer outFile.Close()

	png.Encode(outFile, result)
}
