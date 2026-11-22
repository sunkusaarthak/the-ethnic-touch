package main

import (
	"fmt"
	"log"
	"os"
	"path/filepath"

	"ethnictouch/internal/config"
	"ethnictouch/internal/service"
)

func main() {
	outDir := "email_previews"
	if err := os.MkdirAll(outDir, 0755); err != nil {
		log.Fatalf("Failed to create %s: %v", outDir, err)
	}

	emailSvc := service.NewEmailService(&config.Config{})

	types := []struct {
		key      string
		filename string
		title    string
	}{
		{"prepaid_pickup", "prepaid_store_pickup.html", "Prepaid Store Pickup (Fully Paid)"},
		{"unpaid_pickup", "unpaid_store_pickup.html", "Unpaid Store Pickup (Offline QR / Pay at Store)"},
		{"delivery", "delivery_order.html", "Pan-India Express Delivery Order"},
		{"shipped", "order_shipped.html", "Order Dispatched (Delhivery Express)"},
		{"picked_up", "order_picked_up.html", "Store Pickup Completed (Thank You & Care Guide)"},
	}

	for _, t := range types {
		subject, html, err := emailSvc.GeneratePreview(t.key)
		if err != nil {
			log.Fatalf("Error generating preview for %s: %v", t.key, err)
		}
		path := filepath.Join(outDir, t.filename)
		if err := os.WriteFile(path, []byte(html), 0644); err != nil {
			log.Fatalf("Failed writing %s: %v", path, err)
		}
		fmt.Printf("✅ Generated: %s\n   Subject: %s\n", path, subject)
	}

	// Create Interactive Preview Hub (index.html) with 95% Mobile Viewport Simulator
	hubHTML := `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>The Ethnic Touch — Transactional Email Preview Hub</title>
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,600;1,500&display=swap" rel="stylesheet">
	<style>
		* { box-sizing: border-box; margin: 0; padding: 0; }
		body {
			font-family: 'Inter', -apple-system, sans-serif;
			background: #181615;
			color: #ECE6DE;
			height: 100vh;
			display: flex;
			flex-direction: column;
			overflow: hidden;
		}
		header {
			background: #231F1C;
			border-bottom: 1.5px solid #3A332C;
			padding: 12px 24px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			flex-shrink: 0;
			flex-wrap: wrap;
			gap: 12px;
		}
		.brand-badge {
			display: flex;
			align-items: center;
			gap: 12px;
		}
		.brand-badge img {
			height: 38px;
			width: auto;
		}
		.brand-title {
			font-family: 'Playfair Display', serif;
			font-size: 19px;
			font-style: italic;
			color: #FAF6F0;
		}
		.brand-sub {
			font-size: 10px;
			letter-spacing: 1.8px;
			text-transform: uppercase;
			color: #D4A373;
		}
		.nav-pills {
			display: flex;
			gap: 8px;
			flex-wrap: wrap;
		}
		.nav-btn {
			background: #2F2A25;
			border: 1px solid #483E33;
			color: #D6CCC0;
			padding: 7px 15px;
			border-radius: 20px;
			font-size: 12.5px;
			font-weight: 500;
			cursor: pointer;
			transition: all 0.2s ease;
			text-decoration: none;
		}
		.nav-btn:hover, .nav-btn.active {
			background: #8C5835;
			border-color: #D4A373;
			color: #FFFFFF;
			box-shadow: 0 2px 8px rgba(140,88,53,0.3);
		}
		.viewport-controls {
			display: flex;
			align-items: center;
			gap: 8px;
			background: #2A241F;
			padding: 4px 6px;
			border-radius: 20px;
			border: 1px solid #483E33;
		}
		.view-btn {
			background: transparent;
			border: none;
			color: #A89C8F;
			padding: 4px 12px;
			border-radius: 14px;
			font-size: 11.5px;
			font-weight: 600;
			cursor: pointer;
		}
		.view-btn.active {
			background: #D4A373;
			color: #1E1A17;
		}
		.preview-stage {
			flex: 1;
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 16px;
			background: radial-gradient(circle at center, #26211C 0%, #151312 100%);
			overflow: auto;
		}
		.device-frame {
			width: 100%;
			height: 100%;
			max-width: 100%;
			transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
			display: flex;
			justify-content: center;
			align-items: center;
		}
		.device-frame.mobile {
			max-width: 414px;
			height: 94%;
			background: #000;
			border-radius: 44px;
			padding: 12px 10px 14px 10px;
			box-shadow: 0 20px 60px rgba(0,0,0,0.6), 0 0 0 3px #443B32;
		}
		.device-frame.mobile iframe {
			border-radius: 32px;
		}
		iframe {
			width: 100%;
			height: 100%;
			border: none;
			background: #FAF8F5;
			border-radius: 8px;
		}
	</style>
</head>
<body>
	<header>
		<div class="brand-badge">
			<img src="https://www.theethnictouch.com/navbar-logo.png" alt="Logo" />
			<div>
				<div class="brand-title">The Ethnic Touch</div>
				<div class="brand-sub">Transactional Email Test Suite (95% Mobile-First)</div>
			</div>
		</div>

		<div class="nav-pills">
			<button class="nav-btn active" onclick="loadPreview('prepaid_store_pickup.html', this)">Prepaid Store Pickup</button>
			<button class="nav-btn" onclick="loadPreview('unpaid_store_pickup.html', this)">Unpaid Store Pickup</button>
			<button class="nav-btn" onclick="loadPreview('delivery_order.html', this)">Delivery Order</button>
			<button class="nav-btn" onclick="loadPreview('order_shipped.html', this)">Order Dispatched</button>
			<button class="nav-btn" onclick="loadPreview('order_picked_up.html', this)">Pickup Completed</button>
		</div>

		<div class="viewport-controls">
			<button class="view-btn active" onclick="setMode('mobile', this)">Mobile (414px)</button>
			<button class="view-btn" onclick="setMode('desktop', this)">Full Width</button>
		</div>
	</header>

	<div class="preview-stage">
		<div id="deviceFrame" class="device-frame mobile">
			<iframe id="previewFrame" src="prepaid_store_pickup.html"></iframe>
		</div>
	</div>

	<script>
		function loadPreview(url, btn) {
			document.getElementById('previewFrame').src = url;
			document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
			if (btn) btn.classList.add('active');
		}

		function setMode(mode, btn) {
			const frame = document.getElementById('deviceFrame');
			if (mode === 'mobile') {
				frame.className = 'device-frame mobile';
			} else {
				frame.className = 'device-frame';
			}
			document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
			if (btn) btn.classList.add('active');
		}
	</script>
</body>
</html>`

	hubPath := filepath.Join(outDir, "index.html")
	if err := os.WriteFile(hubPath, []byte(hubHTML), 0644); err != nil {
		log.Fatalf("Failed writing hub %s: %v", hubPath, err)
	}
	fmt.Printf("\n✨ Interactive Preview Hub created at: %s\n", hubPath)
}
