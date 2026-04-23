<?php
/**
 * Template Name: Thiết kế app
 * Template Post Type: service
 */
get_header(); ?>

<main class="service-wrapper">
	<!--     <article class="service-detail service-app-design">
<header class="service-header">
<h1 class="service-title"><?php the_title(); ?></h1>

<?php if (has_post_thumbnail()) : ?>
<div class="service-thumbnail">
<?php the_post_thumbnail('large', ['class' => 'img-responsive']); ?>
</div>
<?php endif; ?>
</header>



<section class="service-content">
<?php the_content(); ?>
</section>
</article> -->
	<style>
		* {
			padding: 0;
			margin: 0;
		}
		p {
			line-height: 150%;
/* 			font-size: 18px; */
		}
		main.service-wrapper > section {
			position: relative;
			z-index: 0;
		}
		.container {
			width: 1400px;
			margin: 0 auto;
			padding: 0;
		}


		.homenest__app-services__app-container {
			padding: 130px 0 100px;
			background: url('/wp-content/uploads/2025/06/aph_bg.webp') top center /contain no-repeat;
		}


		.homenest__app-services__app-container > .container {
			display: flex;
			flex-direction: column;
			align-items: center;
			position: relative;
			max-width: 100%;
		}


		.homenest__app-services__app-container .version-label {
			text-align: center;
		}
		.homenest__app-services__app-container .version-label > p {
			font-weight: 600;
			text-transform: uppercase;
			font-size: 15px;
		}


		.homenest__app-services__app-container .hero-title {
			font-size: 50px;
			width: 650px;
			text-align: center;
			font-weight: 700;
			margin-top: 10px;
		}
		.homenest__app-services__app-container .hero-title > span {
			background-color: #3ed0ff30;
			padding: 6px 12px;
		}


		.homenest__app-services__app-container .download-button {
			display: flex;
			width: 380px;
			justify-content: space-between;
			margin-top: 50px;
		}
		.homenest__app-services__app-container .download-button img {
			height: 55px;
		}


		.homenest__app-services__app-container .app-preview {
			width: 1200px;
			position: relative;
			display: flex;
			justify-content: center;
		}
		.homenest__app-services__app-container .app-preview .mobile-ui-showcase {
			width: 400px;
		}
		.app-preview .mobile-ui-showcase .swiperMobile {
			position: static;
		}
		.homenest__app-services__app-container .app-preview .mobile-ui-showcase .swiperMobile div[role="button"] {
			background-color: #ffffff;
			--size-btn: 60px;
			width: var(--size-btn);
			height: var(--size-btn);
			border-radius: 50%;
			box-shadow: 1px 1px 10px #eee;
			color: #333;
			transform: translateY(-50%);
		}
		.homenest__app-services__app-container .app-preview .mobile-ui-showcase .swiperMobile div[role="button"]::after {
			content: unset;
		}
		.homenest__app-services__app-container .app-preview .banner-body {
			position: absolute;
			font-weight: 900;
			font-size: 220px;
			top: 50%;
			transform: translate(calc(var(--x)), -50%);
			transition: transform var(--transition-duration, .5s) ease;
			--transition-duration: 0s; /* No transition on first render */
		}

		.homenest__app-services__app-container .app-preview .banner-body.active {
			--transition-duration: .5s; /* Enable transition after initial render */
		}
		.homenest__app-services__app-container .app-preview .swiper-slide {
			text-align: center;
		}


		.homenest__app-services__app-container .brands {
			width: 100%;
			margin-top: 50px;
		}
		.homenest__app-services__app-container .brands .swiper-wrapper {
			align-items: center;
		}


		.homenest__app-services__app-container .app-score-box {
			background: url('/wp-content/uploads/2025/06/al_text_bg.webp') center / contain no-repeat;
			filter: drop-shadow(1px 1px 2px #ccc);
			width: 210px;
			height: 110px;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			position: absolute;
			left: 160px;
			top: 210px;
			transform: rotate(-20deg);
		}
		.homenest__app-services__app-container .app-score-box .number {
			font-size: 200%;
			font-weight: 500;
			line-height: 100%;
		}
		.homenest__app-services__app-container .app-score-box .text {
			font-size: 16px;
			font-weight: 500;
		}




		.homenest__app-service__about {
			padding: 100px 0;
			background-color: #000;
			color: #fff;
			position: relative;
		}

		.homenest__app-service__about .about-header {
			text-align: center;
		}

		.homenest__app-service__about .about-header .label {
			text-transform: uppercase;
			font-weight: 500;
		}

		.homenest__app-service__about .about-header .title {
			font-size: 36px;
			margin-top: 12px;
		}

		.homenest__app-service__about .about-content {
			width: 100%;
			display: flex;
			margin-top: 50px;
		}

		.homenest__app-service__about .about-content > div {
			padding-top: 50px;
			padding-bottom: 50px;
			width: 50%;
			position: relative;
		}

		.homenest__app-service__about .about-card--developer {
			display: flex;
			flex-direction: column;
			justify-content: center;
		}

		.homenest__app-service__about .about-card--developer .tag {
			font-weight: 600;
		}

		.homenest__app-service__about .about-card--developer .title {
			text-transform: uppercase;
			display: inline-block;
			font-size: 36px;
			font-weight: 700;
			margin-top: 16px;
		}

		.homenest__app-service__about .about-card--developer .desc {
			color: #ccc;
			margin-top: 32px;
		}

		.homenest__app-service__about .about-card--release {
			padding-left: 72px;
			border-left: 2px solid #181818;
		}

		.homenest__app-service__about .rating {
			width: 130px;
			position: absolute;
			top: 27px;
			right: 50px;
			transform: rotate(-24deg);
		}

		.homenest__app-service__about .rating > img {
			width: 100%;
			opacity: 5%;
		}

		.homenest__app-service__about .rating > span {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			font-weight: 700;
			font-size: 24px;
		}


		.homenest__app-service__about ul.version-list {
			list-style: none;
			font-weight: 700;
			text-transform: uppercase;
		}

		.homenest__app-service__about ul.version-list li {
			line-height: 200%;
		}

		.homenest__app-service__about ul.feature-list {
			list-style: none;
			margin-top: 40px;
		}

		.homenest__app-service__about ul.feature-list li {
			line-height: 280%;
		}

		.homenest__app-service__about ul.feature-list > li::before {
			content: '\f00c';
			font-family: 'Font Awesome 6 Pro';
			background: var(--gradient);
			background-clip: text;
			-webkit-text-fill-color: transparent;
			font-weight: 900;
			margin-right: 10px;
		}

		.homenest__app-service__about img.about-mockup {
			position: absolute;
			right: 0;
			bottom: 0;
			z-index: 0;
		}



		.homemest__app-services__features {
			padding: 100px 40px;
		}
		.homemest__app-services__features .container {
			display: flex;
			align-items: center;
		}
		.homemest__app-services__features .container > div {
			width: 50%;
		}

		.homemest__app-services__features .features-intro {
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			justify-content: center;
			row-gap: 32px;
		}

		.homemest__app-services__features .feature-subtitle {
			display: flex;
			align-items: center;
			gap: 10px;
			font-weight: 500;
			text-transform: uppercase;
			font-size: 15px;
		}

		.homemest__app-services__features .feature-title {
			font-weight: 700;
			font-size: 40px;
		}

		.homemest__app-services__features h2.feature-title > span {
			background-color: #3ed0ff30;
			padding: 6px 12px;
		}

		.homemest__app-services__features a.feature-button {
			padding: 16px 40px;
			display: inline-block;
			background: var(--gradient);
			text-transform: uppercase;
			font-weight: 500;
			font-size: 15px;
			color: #fff;
		}

		.homemest__app-services__features .features-list {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			position: relative;
		}
		.homemest__app-services__features .features-list > img {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
		}
		.homemest__app-services__features .feature-item {
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			row-gap: 24px;
			padding: 0px 32px;
		}
		.homemest__app-services__features .feature-item:hover img {
			animation: featuresBonuce 0.8s ease-out;
		}

		.homemest__app-services__features .feature-item:nth-of-type(odd) {
			border-right: 1px dashed #ccc;
		}

		.homemest__app-services__features .feature-item:nth-of-type(-n+2) {
			border-bottom: 1px dashed #ccc;
			padding-bottom: 36px;
		}

		.homemest__app-services__features .feature-item:nth-of-type(n+3) {
			padding-top: 36px;
		}
		@keyframes featuresBonuce {
			0%, 100%, 20%, 50%, 80% {
				-webkit-transform: translateY(0);
				transform: translateY(0);
			}
			40% {
				-webkit-transform: translateY(-10px);
				transform: translateY(-10px);
			}
			60% {
				-webkit-transform: translateY(-5px);
				transform: translateY(-5px);
			}
		}



		.homenest__app-services__updates {
			padding: 50px 0;
			overflow: hidden;
		}

		.homenest__app-services__updates .container {
			min-width: 100%;
			display: flex;
			gap: 60px;
			align-items: center;
			flex-wrap: nowrap;
			justify-content: center;
		}

		.homenest__app-services__updates .container > h2 {
			text-transform: uppercase;
			font-weight: 700;
			font-size: 80px;
			white-space: nowrap;
		}

		.homenest__app-services__updates .update-center {
			--size: 310px;
			min-width: var(--size);
			height: var(--size);
			position: relative;
			z-index: 0;
		}

		.homenest__app-services__updates .update-center::before {
			content: "";
			position: absolute;
			inset: 0;
			border: 1px dashed #ccc;
			border-radius: 50%;
			animation: circular 10s linear infinite;
		}

		@keyframes circular {
			form {
				transform: rotate(0deg);
			}
			to {
				transform: rotate(360deg);
			}
		}

		.homenest__app-services__updates .upadte-content {
			width: 100%;
			height: 100%;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			row-gap: 16px;
		}

		.homenest__app-services__updates .upadte-content .title {
			font-size: 60px;
			font-weight: 700;
			line-height: 100%;
		}
		.homenest__app-services__updates .upadte-content .desc {
			text-transform: uppercase;
			font-weight: 500;
			font-size: 15px;
		}

		.homenest__app-services__updates .count-years {
			--rotate: 30deg;
			position: absolute;
			inset: 0;
			transform: rotate(var(--rotate));
		}

		.homenest__app-services__updates .count-years .counter {
			--size: 60px;
			width: var(--size);
			height: var(--size);
			align-content: center;
			text-align: center;
			background-color: #fff;
			border-radius: 50%;
			box-shadow: 1px 1px 4px 2px #eee;
			transform: translate(-50%, -50%) rotate(calc(var(--rotate) * -1));
			position: absolute;
			left: 50%;
			font-size: 28px;
			font-weight: 600;
		}



		.homenest__app-services__benifits {
			padding: 100px 0;
			background: url('/wp-content/uploads/2025/06/al-app-bg-scaled-1.webp') bottom center / contain no-repeat;
		}

		.homenest__app-services__benifits .container {
			width: 1200px;
			display: flex;
			flex-direction: column;
			align-items: center;
			row-gap: 64px;
		}

		.homenest__app-services__benifits p.benifits-header-badge {
			display: flex;
			justify-content: center;
			gap: 10px;
			font-size: 15px;
			font-weight: 500;
			text-transform: uppercase;
		}

		.homenest__app-services__benifits h2.benifits-title {
			text-align: center;
			font-size: 48px;
			font-weight: 700;
			margin-top: 16px;
		}

		.homenest__app-services__benifits h2.benifits-title > span {
			background-color: #3ed0ff30;
			padding: 6px 12px;
		}

		.homenest__app-services__benifits .benifits-phone-frame {
			position: relative;
			z-index: 0;
		}
		.swiperNdBenifits :where(.swiper-button-next, .swiper-button-prev) {
			background-color: #ffffff;
			--size-btn: 60px;
			width: var(--size-btn);
			height: var(--size-btn);
			border-radius: 50%;
			box-shadow: 1px 1px 10px #eee;
			color: #333;
			transform: translateY(-50%);
		}
		.swiperNdBenifits .swiper-button-next {

		}
		.swiperNdBenifits .swiper-button-prev {

		}
		.swiperNdBenifits :where(.swiper-button-next, .swiper-button-prev)::after {
			content: unset;
		}

		.homenest__app-services__benifits .benifits-phone-contain {
			position: absolute;
			display: flex;
			justify-content: space-between;
			left: 0;
			right: 0;
			top: 0;
			padding: 0 150px 0 190px;
			height: 100%;
		}

		.homenest__app-services__benifits .benifits-steps {
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			justify-content: center;
			position: relative;
		}

		.homenest__app-services__benifits .benifits-steps > img {
			position: absolute;
			bottom: 60px;
		}
		.homenest__app-services__benifits .benifits-steps ul {
			list-style: none;
			display: flex;
			flex-direction: column;
			gap: 40px;
		}

		.homenest__app-services__benifits .benifits-steps ul li {
			font-size: 18px;
			display: flex;
			align-items: center;
			gap: 8px;
		}


		.homenest__app-services__benifits .benifits-image {
			position: absolute;
			z-index: -1;
			bottom: 30px;
			left: 380px;
		}
		.homenest__app-services__benifits .benifits-download {
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			justify-content: center;
			gap: 36px;
		}

		.homenest__app-services__benifits h3.benifits-download-title.text--gradient {
			font-size: 32px;
			font-weight: 600;
		}

		.homenest__app-services__benifits a.benifits-download-btn {
			border-radius: 5px;
			padding: 16px 36px;
			display: inline-block;
			background: var(--gradient);
			color: #fff;
			font-weight: 500;
		}

		.homenest__app-services__benifits .benifits-platforms {
			display: flex;
			gap: 32px;
		}
		.homenest__app-services__benifits .platform a {
			display: flex;
			flex-direction: column;
			align-items: center;
			color: #000;
			font-size: 14px;
			font-weight: 500;
			gap: 6px;
		}
		.homenest__app-services__benifits .platform a i {
			background: #fff;
			color: #000;
			width: 46px;
			height: 46px;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 18px;
			border-radius: 50%;
			box-shadow: 1px 1px 3px #ccc;
		}
		.homenest__app-services__benifits .benifits-steps span.dot {
			--size: 16px;
			width: var(--size);
			height: var(--size);
			display: inline-block;
			position: relative;
			background-image: linear-gradient(to right, #020C6A 0%, #1A85F8 56.7%, #66E5FB 100%);
			padding: 2px;
			-webkit-mask: linear-gradient(#fff 0 0)content-box,linear-gradient(#fff 0 0);
			mask-composite: exclude;
			border-radius: 50%;
		}

		.homenest__app-services__benifits .benifits-steps li:hover  span.dot {
			-webkit-mask: var(--gradient) content-box, var(--gradient);
		}




		.homenest__app-services__stats {
			position: relative;
			background-color: #000;
			color: #fff;
			z-index: 0;
		}
		.stats-grid {
			display: flex;
			justify-content: space-between;
			padding: 90px 0 70px;
			max-width: 100%;
		}
		.homenest__app-services__stats > img {
			position: absolute;
			z-index: -1;
		}

		.homenest__app-services__stats .hand {
			bottom: 0;
			left: 0;
		}

		.homenest__app-services__stats .flag {
			bottom: 0;
			right: 0;
		}

		.homenest__app-services__stats .stat-card {
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			gap: 20px;
		}
		.homenest__app-services__stats .stat-icon {
			height: 65px;
			padding-left: 16px;
		}

		.homenest__app-services__stats .stat-value {
			font-size: 40px;
			font-weight: 600;
		}

		.homenest__app-services__stats .stat-label {
			font-size: 18px;
			opacity: 70%;
		}



		.homenest__app-services__nd-benifits .container {
			width: 100%;
			padding: 100px 150px;
			display: flex;
			flex-direction: column;
			align-items: center;
			row-gap: 64px;
			box-sizing: border-box;
		}


		.homenest__app-services__nd-benifits .nd-benifits-header {
			text-align: center;
		}

		.homenest__app-services__nd-benifits p.nd-benifits-header-badge {
			display: flex;
			justify-content: center;
			gap: 10px;
			font-size: 15px;
			font-weight: 500;
			text-transform: uppercase;
		}

		.homenest__app-services__nd-benifits h2.nd-benifits-title {
			text-align: center;
			font-size: 48px;
			font-weight: 700;
			margin-top: 16px;
		}

		.homenest__app-services__nd-benifits h2.nd-benifits-title > span {
			background-color: #3ed0ff30;
			padding: 6px 12px;
		}

		.homenest__app-services__nd-benifits .nd-benifits-swiper {
			width: 100%;
		}

		.homenest__app-services__nd-benifits .nd-benifits-item {
			background-color: #f0f2f4;
			padding: 40px;
			border-radius: 12px;
			position: relative;
			height: 550px;
		}

		.homenest__app-services__nd-benifits .nd-benifits-item h3 {
			font-size: 24px;
			line-height: 140%;
		}

		.homenest__app-services__nd-benifits .nd-benifits-item{
			display: flex;
			flex-direction: column;
			align-items: center;
			text-align: center;
			gap: 20px;
		}

		.homenest__app-services__nd-benifits .nd-benifits-item p {
			font-size: 15px;
			text-transform: uppercase;
			font-weight: 500;
		}

		.homenest__app-services__nd-benifits .nd-benifits-item > img:last-of-type {
			width: 100%;
			height: 300px;
			object-fit: contain;
		}

		.homenest__app-services__nd-benifits .nd-benifits-item._2 .flag {
			position: absolute;
			top: -6px;
			left: -21px;
			width: 105px;
		}




		.homenest__app-services__pricing {
			padding-bottom: 100px;
		}
		.homenest__app-services__pricing .pricing-wrapper {
			display: flex;
		}

		.homenest__app-services__pricing .pricing-intro {
			width: 45%;
		}
		.homenest__app-services__pricing p.pricing-subtitle {
			font-size: 15px;
			font-weight: 500;
			text-transform: uppercase;
		}
		.homenest__app-services__pricing h2.pricing-title {
			font-size: 36px;
			font-weight: 700;
			margin-top: 20px;
		}
		.homenest__app-services__pricing h2.pricing-title > span {
			background-color: #3ed0ff30;
			padding: 6px 12px;
		}

		.homenest__app-services__pricing .pricing-card__container {
			width: 55%;
			position: relative;
		}
		.homenest__app-services__pricing .pricing-sale {
			position: absolute;
			bottom: 0;
			left: 0;
			z-index: 0;
			font-size: 95px;
			font-weight: 900;
			text-transform: uppercase;
			transform: translateX(var(--x));
			transition: transform .5s ease;
		}
		.homenest__app-services__pricing .pricing-cards {
			width: 100%;
			display: flex;
			border-color: #f0f2f4;
			border-style: solid;
			border-width: 20px 20px 0 20px;
			position: relative;
			box-sizing: border-box;
		}
		.homenest__app-services__pricing .pricing-card {
			width: 50%;
			position: relative;
			padding: 36px 28px 0;
			display: flex;
			flex-direction: column;
			gap: 12px;
			background: #fff;
			box-sizing: border-box;
		}
		.homenest__app-services__pricing .pricing-card:first-of-type {
			border-right: 1px solid #ccc;
		}
		.homenest__app-services__pricing .badge {
			position: absolute;
			top: 20px;
			right: 20px;
			display: inline-block;
			background: var(--gradient);
			font-size: 14px;
			padding: 4px 16px;
			color: #fff;
			border-radius: 100px;
		}
		.homenest__app-services__pricing .card-icon {
			text-align: center;
		}
		.homenest__app-services__pricing .card-icon img {
			width: 60px;
		}
		.homenest__app-services__pricing h3.card-title {
			text-transform: uppercase;
		}
		.homenest__app-services__pricing h3.card-title, .card-price {
			text-align: center;
		}
		.homenest__app-services__pricing .card-price {
			padding-bottom: 30px;
			border-bottom: 1px solid #ccc;
			display: flex;
			flex-direction: column;
			gap: 5px;
		}
		.homenest__app-services__pricing span.price-amount {
			font-weight: 700;
			font-size: 40px;
		}
		.homenest__app-services__pricing span.price-period {
			display: block;
		}
		.homenest__app-services__pricing ul.card-features {
			list-style: none;
			margin-top: 20px;
			margin-bottom: 24px;
		}
		.homenest__app-services__pricing ul.card-features li {
			display: flex;
			align-items: center;
		}
		.homenest__app-services__pricing ul.card-features li:not(:last-of-type) {
			margin-bottom: 20px;
		}
		.homenest__app-services__pricing ul.card-features li::before {
			content: '\f00c';
			font-family: 'Font Awesome 6 Pro' !important;
			font-weight: 900;
			background: var(--gradient);
			-webkit-text-fill-color: transparent;
			background-clip: text;
			padding-right: 12px;
		}
		.homenest__app-services__pricing a.btn-trial {
			display: flex;
			justify-content: center;
			background: var(--gradient);
			line-height: 54px;
			color: #fff;
			font-size: 17px;
			margin-top: auto;
		}




		@keyframes marqueeIntigration {
			0% {
				transform: translateX(0);
			}
			100% {
				transform: translateX(calc(var(--width) * -1));
			}
		}
		.homenest__app-services__intigration {
			background: url('/wp-content/uploads/2025/06/intigration_bg-min.webp') top center / cover no-repeat;
			padding: 100px 0;
			display: flex;
			flex-direction: column;
			gap: 32px;
		}
		.intigration-header {
			display: flex;
			flex-direction: column;
			gap: 12px;
		}
		h2.intigration-title {
			font-size: 36px;
			font-weight: 700;
		}
		h2.intigration-title > span {
			background-color: #3ed0ff30;
			padding: 6px 12px;
		}
		p.intigration-header-badge {
			display: flex;
			gap: 10px;
			font-size: 15px;
			font-weight: 500;
			text-transform: uppercase;
		}
		.homenest__app-services__intigration .container {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 32px;
		}
		.intigration-btn-see-video button {
			border: 0;
			background: transparent;
			font-size: 16px;
			font-weight: 500;
			display: flex;
			align-items: center;
			gap: 12px;
		}
		.intigration-btn-see-video i {
			font-size: 56px;
		}
		.intigration-marquee {
			display: flex;
		}
		.intigration__st-marquee .intigration-marquee {
			animation: marqueeIntigration 30s infinite linear;
		}
		.intigration__nd-marquee .intigration-marquee {
			animation: marqueeIntigration 30s infinite linear reverse;
		}
		.intigration__st-marquee, .intigration__nd-marquee {
			overflow: hidden;
		}
		.intigration-container {
			display: flex;
			width: min-content;
		}
		.intigration-item {
			min-width: 500px;
			padding: 48px;
			margin-right: 32px;
			background-color: #fff;
			box-shadow: 1px 1px 5px #ccc;
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			gap: 16px;
		}
		.intigration-item h3 {
			text-transform: uppercase;
			font-weight: 700;
		}
		.intigration-item img {
			height: 22px;
			width: 100%;
			object-fit: contain;
			object-position: right;
			margin-top: -10px;
		}




		.homenest__app-services__testimonial {
			padding-top: 100px;
			overflow: hidden;
		}
		.homenest__app-services__testimonial .container {
			position: relative;
			padding-bottom: 100px;
		}
		.homenest__app-services__testimonial .testimonial-header {
			text-align: center;
		}

		.homenest__app-services__testimonial p.testimonial-header-badge {
			display: flex;
			justify-content: center;
			gap: 10px;
			font-size: 15px;
			font-weight: 500;
			text-transform: uppercase;
		}

		.homenest__app-services__testimonial h2.testimonial-title {
			text-align: center;
			font-size: 48px;
			font-weight: 700;
			margin-top: 16px;
		}

		.homenest__app-services__testimonial h2.testimonial-title > span {
			background-color: #3ed0ff30;
			padding: 6px 12px;
		}

		.testimonial-sub-avatar > img {
			width: 100px;
		}
		.testimonial-reviews {
			position: absolute;
			inset: 0;
			text-align: center;
			align-content: center;
			padding: 0 200px;
		}
		.testimonial-review {
			margin-top: 64px;
			position: relative;
			display: flex;
			flex-direction: column;
			align-items: center;
		}
		.testimonial-main-review {
			width: 1100px;
			position: relative;
			margin-top: -160px;
		}
		.testimonial-main-avatar {
			text-align: center;
		}
		.testimonial-main-avatar img {
			width: 350px;
			aspect-ratio: 1;
			border-radius: 50%;
		}
		img.testimonial-background {
			width: 100%;
		}
		.testimonial-review-info {
			margin-top: 40px;
		}
		.testimonial-review-star {
			display: inline-flex;
			background: url('/wp-content/uploads/2025/06/rating_shape-1.svg') center / contain no-repeat;
			padding: 16px 24px;
			gap: 2px;
		}
		.testimonial-review-star i {
			color: #FFB11B;
		}
		.testimonial-sub-avatar {
			position: absolute;
		}
		.testimonial-sub-avatar:nth-of-type(3) {
			top: 0;
			left: 0;
		}
		.testimonial-sub-avatar:nth-of-type(4) {
			bottom: 40px;
			left: -90px;
			transform: scale(70%);
		}
		.testimonial-sub-avatar:nth-of-type(5) {
			top: 35px;
			right: 60px;
			transform: scale(85%);
		}
		.testimonial-sub-avatar:nth-of-type(6) {
			bottom: 45px;
			right: 0;
			transform: scale(95%);
		}

		.testimonial-sub-avatar img {
			border-radius: 50%;
			border: 5px solid #f0f2f4;
			box-shadow: 2px 2px 5px #ccc;
		}
		.testimonial-icons {
			position: absolute;
			inset: 0;
			z-index: -1;
		}
		.testimonial-icons > img {
			position: absolute;
		}
		.testimonial-icons > img:nth-of-type(1) {
			left: 190px;
			top: 260px;
		}
		.testimonial-icons > img:nth-of-type(2) {
			left: 80px;
			top: 450px;
		}
		.testimonial-icons > img:nth-of-type(3) {
			right: 240px;
			top: 160px;
		}
		.testimonial-icons > img:nth-of-type(4) {
			bottom: 10px;
			right: 40px;
		}
		.testimonial-icons > img:nth-of-type(5) {
			top: 220px;
			left: 50%;
			width: 400px;
			transform: translateX(-50%);
			filter: blur(100px);
		}





		@keyframes zoomEmoji {
			0%, 100% {
				transform: scale(110%);
			}

			50% {
				transform: scale(100%);
			}
		}

		.homenest__app-services__thanks {
			overflow: hidden;
			padding: 50px 0 100px;
		}

		.homenest__app-services__thanks .container {
			display: flex;
			flex-wrap: nowrap;
			width: 100%;
			align-items: center;
			justify-content: center;
			column-gap: 96px;
		}
		.homenest__app-services__thanks .container > img {
			animation: 3s linear var(--d) infinite normal none running zoomEmoji;
		}



		.homenest__app-services__thanks h2 {
			text-transform: uppercase;
			font-weight: 700;
			font-size: 80px;
			white-space: nowrap;
		}	

		.homenest__app-services__thanks .thanks-content {
			width: fit-content;
			padding: 48px 40px;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			position: relative;
			row-gap: 12px;
		}
		.homenest__app-services__thanks .thanks-content::before {
			content: "";
			position: absolute;
			inset: 0;
			background-image: linear-gradient(to right, #020C6A 0%, #1A85F8 56.7%, #66E5FB 100%);
			padding: 1px 1px 1px 1px;
			-webkit-mask: linear-gradient(#fff 0 0)content-box,linear-gradient(#fff 0 0);
			mask-composite: exclude;
			border-radius: 200px;
		}
		.homenest__app-services__thanks .thanks-content .title {
			text-transform: uppercase;
			font-weight: 700;
			font-size: 64px;
			line-height: 100%;
		}
		.homenest__app-services__thanks .thanks-content .desc {
			font-size: 15px;
			font-weight: 500;
			text-transform: uppercase;
		}


		@media only screen and (max-width: 1600px) {
			.container {
				width: 1300px;
				max-width: 100%;
			}
			.homenest__app-services__app-container .app-preview .banner-body {
				font-size: 200px;
			}

			.homenest__app-services__nd-benifits .container {
				width: 1300px;
				padding: 100px 0px;
				max-width: 100%;
			}

			.homenest__app-services__app-container .hero-title,
			.homenest__app-services__nd-benifits h2.nd-benifits-title,
			.homenest__app-services__benifits h2.benifits-title,
			.homenest__app-services__testimonial h2.testimonial-title{
				font-size: 44px;
			}

			.testimonial-sub-avatar:nth-of-type(3) {
				top: 0;
				left: 40px;
			}
			.testimonial-sub-avatar:nth-of-type(4) {
				bottom: 40px;
				left: -20px;
				transform: scale(60%);
			}
			.testimonial-sub-avatar:nth-of-type(5) {
				top: 35px;
				right: 80px;
				transform: scale(85%);
			}
			.testimonial-sub-avatar:nth-of-type(6) {
				bottom: 45px;
				right: 30px;
				transform: scale(95%);
			}

			.homenest__app-services__thanks .container {
				column-gap: 50px;
			}
		}


		@media only screen and (max-width: 1350px) {
			.homenest__app-services__updates .flag {
				width: 175px;
			}

			.homenest__app-services__updates .container > h2 {
				font-size: 56px;
			}

			.testimonial-sub-avatar:nth-of-type(3) {
				top: 10px;
				left: 120px;
				transform: scale(90%);
			}
			.testimonial-sub-avatar:nth-of-type(4) {
				bottom: 40px;
				left: 70px;
				transform: scale(55%);
			}
			.testimonial-sub-avatar:nth-of-type(5) {
				top: 50px;
				right: 150px;
				transform: scale(80%);
			}
			.testimonial-sub-avatar:nth-of-type(6) {
				bottom: 10px;
				right: 100px;
				transform: scale(75%);
			}
			.homenest__app-services__thanks .thanks-content .title {
				font-size: 40px;
			}
			.homenest__app-services__thanks .thanks-content .desc {
				font-size: 14px;
				white-space: nowrap;
			}
			.homenest__app-services__thanks .thanks-content {
				padding: 40px 48px;
			}
			.homenest__app-services__thanks h2 {
				font-size: 44px;
			}
			.homenest__app-services__thanks .container > img {
				margin-bottom: -60px;
			}
			.homenest__app-services__thanks .container {
				column-gap: 60px;
			}
		}


		@media only screen and (max-width: 1200px) {
			.container {
				width: 100%;
				box-sizing: border-box;
			}
			.homenest__app-services__app-container > .container {
				padding: 0 28px;
			}

			.homenest__app-services__app-container .app-score-box {
				left: 50px;
				top: 200px;
			}

			.homenest__app-services__app-container .app-preview .banner-body {
				font-size: 145px;
			}

			.homenest__app-services__app-container .app-preview {
				width: calc(100% - 60px * 2);
				margin: 0 auto;
			}
			.homenest__app-services__app-container .app-preview .mobile-ui-showcase {
				width: 300px;
			}
			.homenest__app-service__about {
				padding: 100px 28px;
			}
			.homenest__app-service__about img.about-mockup {
				display: none;
			}

			section.homenest__app-services__app-container .swiper-slide img {
				width: 100%;
			}
			section.homenest__app-services__app-container .brands .swiper-slide img {
				width: 75%;
			}
			.homenest__app-services__app-container .app-preview .mobile-ui-showcase .swiperMobile div[role="button"] {
				--size-btn: 50px;
			}
			.homemest__app-services__features {
				padding: 100px 24px;
			}
			.homemest__app-services__features .feature-title {
				font-weight: 700;
				font-size: 36px;
			}
			.homenest__app-services__updates .update-center {
				--size: 280px;
			}
			.homenest__app-services__updates .upadte-content .title {
				font-size: 50px;
			}
			.homenest__app-services__updates .flag {
				width: 150px;
			}
			.homenest__app-services__updates .container {
				gap: 35px;
			}
			.homenest__app-services__updates .container > h2 {
				font-size: 40px;
			}
			.homenest__app-services__app-container .hero-title, .homenest__app-services__nd-benifits h2.nd-benifits-title, .homenest__app-services__benifits h2.benifits-title, .homenest__app-services__testimonial h2.testimonial-title {
				font-size: 36px;
			}
			.homenest__app-services__benifits {
				padding: 100px 20px;
			}
			.homenest__app-services__benifits .container {
				width: 100%;
			}
			.homenest__app-services__benifits .benifits-phone-contain {
				padding: 0 100px 0 120px;
			}
			.homenest__app-services__benifits .benifits-image {
				bottom: 28px;
				left: 300px;
				width: 280px;
			}
			.homenest__app-services__benifits img.phone-frame {
				width: 100%;
			}
			.homenest__app-services__benifits .benifits-image  img {
				width: 100%;
			}
			.homenest__app-services__stats {
				padding: 0 28px;
			}
			.homenest__app-services__nd-benifits .container {
				width: 100%;
				padding: 100px 120px;
			}
			.homenest__app-services__pricing {
				padding-left: 28px;
				padding-right: 28px;
			}
			.homenest__app-services__pricing .pricing-intro {
				width: 33%;
			}
			.homenest__app-services__pricing .pricing-card__container {
				width: 67%;
			}
			.homenest__app-services__pricing .pricing-sale {
				bottom: 40px;
				font-size: 75px;
			}
			.homenest__app-services__intigration .container {
				padding: 0 28px;
			}
			.homenest__app-services__thanks .container > img {
				width: 100px;
				margin-bottom: -40px;
			}
			.homenest__app-services__thanks .thanks-content .title {
				font-size: 32px;
			}
			.homenest__app-services__thanks h2 {
				font-size: 36px;
			}
			.homenest__app-services__thanks .container {
				column-gap: 36px;
			}
			.testimonial-main-review {
				width: 100%;
			}
		} 

		@media only screen and (max-width: 991px) {
			.homenest__app-services__app-container .app-score-box {
				display: none;
			}
			.homenest__app-services__app-container .hero-title {
				width: 560px;
			}
			.homenest__app-services__app-container .app-preview {
				width: calc(100% - 0px * 2);
			}
			.homenest__app-services__app-container .app-preview .banner-body {
				font-size: 115px;
			}
			.homenest__app-services__app-container .app-preview .mobile-ui-showcase {
				width: 270px;
			}

			.homenest__app-service__about .about-content {
				flex-direction: column;
				gap: 50px;
			}
			.homenest__app-service__about .about-content > div {
				padding-top: 0;
				padding-bottom: 0;
				width: 100%;
			}
			.homenest__app-service__about .about-card--release {
				padding-left: 0;
				border-left: 0;
			}
			.homenest__app-service__about .about-header .title {
				font-size: 32px;
			}
			.homenest__app-service__about .about-card--developer .title {
				font-size: 32px;
			}
			.homenest__app-services__updates .flag {
				display: none;
			}
			.homenest__app-services__updates .container > h2 {
				font-size: 32px;
			}
			.homenest__app-services__benifits .benifits-phone-frame {
				width: 100%;
			}
			.homenest__app-services__benifits img.phone-frame {
				display: none;
			}
			.homenest__app-services__benifits .benifits-phone-contain {
				padding: 0;
				position: static;
			}
			.homenest__app-services__benifits .benifits-image {
				display: none;
			}
			.homenest__app-services__benifits .benifits-steps > img {
				position: static;
				width: 100%;
				height: 80px;
				margin-top: 40px;
				object-fit: contain;
			}
			.stats-grid {
				display: grid;
				grid-template-columns: repeat(2, 1fr);
				grid-gap: 36px 0px;
				width: 100%;
			}
			.homenest__app-services__stats .stat-card {
				align-items: center;
				gap: 16px;
			}
			.homenest__app-services__nd-benifits .container {
				padding: 100px 40px;
			}
			.homenest__app-services__pricing .pricing-wrapper {
				flex-direction: column;
				gap: 50px;
			}
			.homenest__app-services__pricing .pricing-wrapper > div {
				width: 100%;
			}
			.homenest__app-services__pricing h2.pricing-title {
				font-size: 32px;
			}
			.homenest__app-services__pricing h2.pricing-title br {
				display: none;
			}
			h2.intigration-title {
				font-size: 32px;
			}
			.intigration-item {
				min-width: 450px;
				padding: 40px 40px 20px;
			}
			.intigration-item p {
				font-size: 16px;
			}
			.intigration-item h3 {
				font-size: 18px;
			}
			img.testimonial-background {
				width: 100%;
				display: none;
			}
			.testimonial-main-review {
				padding: 0 50px;
			}
			.testimonial-reviews {
				position: static;
				background: #fff;
				padding: 28px 32px;
			}
			p.testimonial-review-text {
				font-size: 16px;
				margin-top: 16px;
			}
			.testimonial-sub-avatar:nth-of-type(3) {
				top: -10px;
				left: 90px;
				transform: scale(85%);
			}
			.testimonial-sub-avatar:nth-of-type(4) {
				bottom: -18px;
				left: 24px;
				transform: scale(50%);
			}
			.testimonial-sub-avatar:nth-of-type(5) {
				top: 20px;
				right: 115px;
				transform: scale(65%);
			}
			.testimonial-sub-avatar:nth-of-type(6) {
				bottom: -30px;
				right: 50px;
				transform: scale(70%);
			}
			.homenest__app-services__thanks .container {
				column-gap: 16px;
			}
			.homenest__app-services__thanks h2 {
				font-size: 24px;
			}
			.homenest__app-services__thanks .thanks-content {
				padding: 36px 36px;
			}
			.homenest__app-services__thanks .thanks-content .title {
				font-size: 28px;
			}
		}

		@media only screen and (max-width: 767px) {
			.homenest__app-services__app-container .hero-title, .homenest__app-services__nd-benifits h2.nd-benifits-title, .homenest__app-services__benifits h2.benifits-title, .homenest__app-services__testimonial h2.testimonial-title {
				font-size: 32px;
			}
			.homenest__app-services__app-container .hero-title {
				width: 480px;
			}
			.homenest__app-services__app-container .app-preview {
				width: auto;
			}
			.homenest__app-service__about {
				padding: 100px 10px;
			}
			.homenest__app-service__about > .container {
				max-width: 540px;
			}
			.homemest__app-services__features .container {
				flex-direction: column;
				row-gap: 50px;
			}
			.homemest__app-services__features .container > div {
				width: 100%;
			}
			p.feature-description {
				font-size: 16px;
			}
			.homenest__app-services__updates .container {
				gap: 16px;
			}
			.homenest__app-services__updates .container > h2 {
				font-size: 28px;
			}
			.homenest__app-services__updates .upadte-content .desc {
				font-size: 13px;
			}
			.homenest__app-services__updates .update-center {
				--size: 230px;
			}
			.homenest__app-services__updates .upadte-content {
				row-gap: 8px;
			}
			.homenest__app-services__nd-benifits .container {
				padding: 100px 20px;
			}

			.homenest__app-services__testimonial {
				padding-top: 0;
			}
			.testimonial-review {
				margin-top: 64px;
				flex-direction: row;
				flex-wrap: wrap;
			}
			.testimonial-sub-avatar {
				position: static;
				width: 24%;
				height: 60px;
				text-align: center;
				transform: scale(100%) !important;
			}
			.testimonial-sub-avatar img {
				border: 3px solid #f0f2f4;
				height: 100%;
				width: auto;
			}
			.testimonial-main-avatar {
				width: 100%;
			}

			.homenest__app-services__thanks .container > img {
				width: 100px;
				margin-bottom: -40px;
				display: none;
			}

		}

		@media only screen and (max-width: 480px)  {
			.homenest__app-services__app-container .hero-title, .homenest__app-services__nd-benifits h2.nd-benifits-title, .homenest__app-services__benifits h2.benifits-title, .homenest__app-services__testimonial h2.testimonial-title, .homemest__app-services__features .feature-title, h2.intigration-title {
				font-size: 28px;
			}

			.homenest__app-services__app-container {
				overflow: hidden;
			}
			.homenest__app-services__app-container > .container {
				padding: 0 16px;
			}
			.homenest__app-services__app-container .hero-title {
				width: 100%;
			}
			.homenest__app-services__app-container .download-button {
				width: 100%;
				justify-content: center;
				gap: 16px;
			}
			.homenest__app-services__app-container .download-button img {
				height: 50px;
			}

			.homenest__app-service__about {
				padding: 72px 10px;
			}

			.homenest__app-service__about .rating {
				display: none;
			}

			.homemest__app-services__features {
				padding: 72px 16px;
			}
			.homemest__app-services__features .features-list {
				grid-template-columns: repeat(1, 1fr);
				grid-gap: 32px;
			}
			.homemest__app-services__features .feature-item {
				padding: 0 !important;
				border: 0 !important;
				row-gap: 16px;
			}
			.homemest__app-services__features .features-list > img {
				display: none;
			}

			.homenest__app-services__updates {
				padding: 22px 0;
			}
			.homenest__app-services__updates .container {
				gap: 20px;
				flex-direction: column;
			}


			.homenest__app-services__benifits .benifits-phone-contain {
				flex-direction: column;
				gap: 50px;
			}
			.homenest__app-services__benifits .benifits-steps ul {
				gap: 24px;
			}
			.homenest__app-services__benifits .benifits-steps > img {
				display: none;
			}
			.homenest__app-services__benifits .benifits-download {
				gap: 28px;
			}

			.homenest__app-services__stats {
				padding: 0 16px;
			}
			.stats-grid {
				grid-gap: 36px 16px;
			}
			.homenest__app-services__stats > img {
				display: none;
			}

			.homenest__app-services__pricing {
				padding-left: 16px;
				padding-right: 16px;
			}
			.homenest__app-services__pricing .pricing-cards {
				border-width: 16px 16px 0 16px;
				flex-direction: column;
			}
			.homenest__app-services__pricing .pricing-card {
				width: 100%;
				border: none !important;
			}

			.homenest__app-services__intigration {
				gap: 16px;
			}
			.homenest__app-services__intigration .container {
				padding: 0 16px;
				flex-direction: column;
				align-items: flex-start;
				gap: 32px;
			}
			.intigration-item {
				min-width: 270px;
				padding: 24px 24px 20px;
				margin-right: 16px;
			}

			.testimonial-main-review {
				padding: 0 16px;
				margin-top: -100px;
			}
			.testimonial-main-avatar img {
				width: 250px;
			}
			.testimonial-reviews {
				padding: 28px 16px;
			}

			.homenest__app-services__testimonial {
				overflow: hidden;
			}
			.homenest__app-services__thanks .container {
				flex-direction: column;
				row-gap: 12px;
			}
		}



	</style>


	<section class="homenest__app-services__app-container">
		<div class="container">
			<div class="version-label">
				<img src="/wp-content/uploads/2025/06/al_icon.svg" alt="">
				<p>News verson release <span>2.05</span></p>
			</div>
			<h1 class="hero-title">Make Business <span><span class="text--gradient">Growing</span></span> by using our mobile apps</h1>
			<div class="download-button">
				<a class="btn-app" href=""><img src="/wp-content/uploads/2025/06/Google_Play_Store_badge_EN.svg.webp" alt=""></a>
				<a class="btn-app" href=""><img src="/wp-content/uploads/2025/06/app-store.webp" alt=""></a>
			</div>
			<div class="app-preview">
				<div class="mobile-ui-showcase">
					<div class="swiper swiperMobile">
						<div class="swiper-wrapper">
							<div class="swiper-slide">
								<img src="/wp-content/uploads/2025/06/img-06-min.webp" alt="">
							</div>
							<div class="swiper-slide">
								<img src="/wp-content/uploads/2025/06/img-06-min.webp" alt="">
							</div>
						</div>
						<div class="swiper-button-next"><i class="fa-regular fa-chevron-right"></i></div>
						<div class="swiper-button-prev"><i class="fa-regular fa-chevron-left"></i></div>
					</div>
				</div>
				<div class="banner-body text--gradient">UPDATES</div>
			</div>
			<div class="brands">
				<div class="swiper swiperBrands">
					<div class="swiper-wrapper">
						<div class="swiper-slide">
							<img src="/wp-content/uploads/2025/06/al_test_01.webp" alt="">
						</div>
						<div class="swiper-slide">
							<img src="/wp-content/uploads/2025/06/img_01-4.webp" alt="">
						</div>
						<div class="swiper-slide">
							<img src="/wp-content/uploads/2025/06/img_02-2-1.webp" alt="">
						</div>
						<div class="swiper-slide">
							<img src="/wp-content/uploads/2025/06/img_03-2.webp" alt="">
						</div>
						<div class="swiper-slide">
							<img src="/wp-content/uploads/2025/06/img_04-1-1.webp" alt="">
						</div>
						<div class="swiper-slide">
							<img src="/wp-content/uploads/2025/06/img_05-1-1.webp" alt="">
						</div>
						<div class="swiper-slide">
							<img src="/wp-content/uploads/2025/06/img_06-1-1.webp" alt="">
						</div>
					</div>
				</div>
			</div>
			<div class="app-score-box">
				<p class="number">5.00</p>
				<p class="text">Top selling Apps</p>
			</div>
		</div>
	</section>



	<section class="homenest__app-service__about">
		<div class="container">
			<div class="about-header">
				<div class="label">About apps & development</div>
				<h2 class="title">About Apps & <span class="text--gradient">Developer</span> History</h2>
			</div>
			<div class="about-content">
				<div class="about-card--developer">
					<p class="tag">- DEVELOPED BY</p>
					<h3 class="title text--gradient">themexriver team</h3>
					<p class="desc">Far far away, behind the word mountains, far from the countries <br> Vokalia and Consonantia, there live the blind texts.</p>
					<div class="rating"><img src="/wp-content/uploads/2025/06/al_text_bg.webp"><span>5.00</span></div>
				</div>
				<div class="about-card--release">

					<ul class="version-list">
						<li><span  class="text--gradient">First release verson 1.0</span></li>
						<li><span  class="text--gradient">News verson release 2.00</span></li>
					</ul>
					<ul class="feature-list">
						<li>Essential Importance for customer friendly apps</li>
						<li>Daily updates & Come new features</li>
					</ul>
				</div>
			</div>
			<img src="/wp-content/uploads/2025/06/ss_01-1.webp" alt="" class="about-mockup">
		</div>
	</section>


	<section class="homemest__app-services__features">
		<div class="container">
			<div class="features-intro">
				<div class="feature-subtitle"><img src="/wp-content/uploads/2025/06/al_icon.svg"><span class="text--gradient">Great Features of Appico</span></div>
				<h2 class="feature-title">Appic Great <span><span class="text--gradient">Features</span></span><br> You Must Enjoy!</h2>
				<p class="feature-description">All our content marketing service packages include a custom <br>
					content strategyAll our content marketing service packages <br>
					include a custom content strategy.</p>
				<div class="feature-highlight">Essential Importance for customer friendly apps</div>
				<a href="#" class="feature-button">All Features</a>
			</div>
			<div class="feature-contain">
				<div class="features-list">
					<div class="feature-item">
						<img class="feature-icon" src="/wp-content/uploads/2025/06/cb_01.webp">
						<h3 class="feature-item-title">Create Free Account</h3>
						<p class="feature-item-desc">All our content marketing service packages include a custom content strategy</p>
					</div>
					<div class="feature-item">
						<img class="feature-icon" src="/wp-content/uploads/2025/06/cb_02.webp">
						<h3 class="feature-item-title">Fast Customer Support</h3>
						<p class="feature-item-desc">All our content marketing service packages include a custom content strategy</p>
					</div>
					<div class="feature-item">
						<img class="feature-icon" src="/wp-content/uploads/2025/06/cb_03.webp">
						<h3 class="feature-item-title">VIP support System</h3>
						<p class="feature-item-desc">All our content marketing service packages include a custom content strategy</p>
					</div>
					<div class="feature-item">
						<img class="feature-icon" src="/wp-content/uploads/2025/06/cb_04.webp">
						<h3 class="feature-item-title">Secured platform</h3>
						<p class="feature-item-desc">All our content marketing service packages include a custom content strategy</p>
					</div>
					<img src="/wp-content/uploads/2025/06/alf_shape-1.svg">
				</div>
			</div>
		</div>
	</section>


	<section class="homenest__app-services__updates">
		<div class="container">
			<h2 class="text--gradient">
				2.0 updates
			</h2>
			<img class="flag" src="/wp-content/uploads/2025/06/fact_shape1.webp">

			<div class="update-center">
				<div class="upadte-content">
					<img class="icon" src="/wp-content/uploads/2025/06/al_icon.svg">
					<p class="title text--gradient">
						YEARS
					</p>
					<p class="desc">
						hard wordking make apps
					</p>
				</div>
				<div class="count-years">
					<div class="counter">
						<span class="text--gradient">02</span>
					</div>
				</div>
			</div>

			<img class="flag" src="/wp-content/uploads/2025/06/fact_shape2.webp">

			<h2 class="text--gradient">
				App landing
			</h2>

		</div>
	</section>




	<section class="homenest__app-services__benifits">
		<div class="container">

			<div class="benifits-header">
				<p class="benifits-header-badge"><img src="/wp-content/uploads/2025/06/al_icon.svg"><span>Easy procedure to install</span></p>
				<h2 class="benifits-title">
					What The <span><span class="text--gradient">Benifits</span></span> To <br> Install This App!
				</h2>
			</div>

			<div class="benifits-phone-frame">
				<img class="phone-frame" src="/wp-content/uploads/2025/06/mobile_frame.webp">

				<div class="benifits-phone-contain">
					<div class="benifits-steps">
						<ul>
							<li><span class="dot"></span><span>Make a profile</span></li>
							<li><span class="dot"></span><span>Download it for free</span></li>
							<li><span class="dot"></span><span>Enjoy orixy app</span></li>
						</ul>
						<img src="/wp-content/uploads/2025/06/al_app_icon1.webp">
					</div>

					<div class="benifits-image">
						<img src="/wp-content/uploads/2025/06/al_app_icon2-e1748241749314.webp" alt="App Illustration">
					</div>

					<div class="benifits-download">
						<h3 class="benifits-download-title text--gradient">Download Now appic</h3>
						<p class="benifits-download-label">Available Version:</p>
						<div class="benifits-platforms">
							<div class="platform"><a href="#"><i class="fa-brands fa-apple"></i><span>iOS</span></a></div>
							<div class="platform"><a href="#"><i class="fa-brands fa-windows"></i><span>Windows</span></a></div>
							<div class="platform"><a href="#"><i class="fa-brands fa-android"></i><span>Android</span></a></div>
							<div class="platform"><a href="#"><i class="fa-solid fa-desktop"></i><span>Mac OS</span></a></div>
						</div>
						<a href="#" class="benifits-download-btn">Download Zip</a>
					</div>
				</div>

			</div>

		</div>
	</section>




	<section class="homenest__app-services__stats">
		<img class="hand" src="/wp-content/uploads/2025/06/hand.webp">
		<img class="flag" src="/wp-content/uploads/2025/06/al_counter_shape.webp">
		<div class="container stats-grid">

			<!-- Stat item -->
			<div class="stat-card">
				<img  class="stat-icon" src="/wp-content/uploads/2025/06/count_01.svg" alt="Download Icon">
				<div class="stat-value">600K+</div>
				<div class="stat-label">Total Downloads</div>
			</div>

			<!-- Stat item -->
			<div class="stat-card">
				<img  class="stat-icon" src="/wp-content/uploads/2025/06/count_02.svg" alt="Download Icon">
				<div class="stat-value">140K+</div>
				<div class="stat-label">Love Impressions</div>
			</div>

			<!-- Stat item -->
			<div class="stat-card">
				<img  class="stat-icon" src="/wp-content/uploads/2025/06/count_03.svg" alt="Download Icon">
				<div class="stat-value">3.5K+</div>
				<div class="stat-label">5 star odometers</div>
			</div>

			<!-- Stat item -->
			<div class="stat-card">
				<img  class="stat-icon" src="/wp-content/uploads/2025/06/count_01.svg" alt="Download Icon">
				<div class="stat-value">221+</div>
				<div class="stat-label">internation Award</div>
			</div>

		</div>
	</section>



	<section  class="homenest__app-services__nd-benifits">

		<div class="container">
			<div class="nd-benifits-header">
				<p class="nd-benifits-header-badge"><img src="/wp-content/uploads/2025/06/al_icon.svg"><span>Easy procedure to install</span></p>
				<h2 class="nd-benifits-title">
					What The <span><span class="text--gradient">Benifits</span></span> To <br> Install This App!
				</h2>
			</div>

			<div class="nd-benifits-swiper">
				<div class="swiper swiperNdBenifits">
					<div class="swiper-wrapper">
						<div class="swiper-slide">
							<div class="nd-benifits-item _1">
								<h3>Smart Secure Login</h3>
								<p>our content marketing  <br>service packages include a cust</p>
								<a><span>See Sample</span> <img src="/wp-content/uploads/2025/06/arrow_icon2.svg"></a>
								<img  src="/wp-content/uploads/2025/06/img_03-3.webp">
							</div>
						</div>

						<div class="swiper-slide">
							<div class="nd-benifits-item _2">
								<img class="flag" src="/wp-content/uploads/2025/06/al_counter_shape.webp">
								<img src="/wp-content/uploads/2025/06/al_icon.svg">
								<p>News verson release 2.05</p>
								<h3>Photo uploading option <br>  in our  <span>application</span></h3>
								<img src="/wp-content/uploads/2025/06/img_04-2.webp">
							</div>

						</div>

						<div class="swiper-slide">
							<div class="nd-benifits-item _3">
								<img src="/wp-content/uploads/2025/06/al_icon.svg">
								<p>News verson release 2.05</p>
								<h3>Defalut ui looking good  <br>  in our  <span>application</span></h3>
								<img src="/wp-content/uploads/2025/06/img_01-5.webp">
							</div>

						</div>

						<div class="swiper-slide">
							<div class="nd-benifits-item _4">
								<img src="/wp-content/uploads/2025/06/al_icon.svg">
								<p>News verson release 2.05</p>
								<h3>QR Code varification <br>  when you want to access</h3>
								<img src="/wp-content/uploads/2025/06/al_app_icon2-e1748241749314.webp">
							</div>
						</div>


						<div class="swiper-slide">
							<div class="nd-benifits-item _1">
								<h3>Smart Secure Login</h3>
								<p>our content marketing  <br>service packages include a cust</p>
								<a><span>See Sample</span> <img src="/wp-content/uploads/2025/06/arrow_icon2.svg"></a>
								<img  src="/wp-content/uploads/2025/06/img_03-3.webp">
							</div>
						</div>

						<div class="swiper-slide">
							<div class="nd-benifits-item _2">
								<img class="flag" src="/wp-content/uploads/2025/06/al_counter_shape.webp">
								<img src="/wp-content/uploads/2025/06/al_icon.svg">
								<p>News verson release 2.05</p>
								<h3>Photo uploading option <br>  in our  <span>application</span></h3>
								<img src="/wp-content/uploads/2025/06/img_04-2.webp">
							</div>

						</div>

						<div class="swiper-slide">
							<div class="nd-benifits-item _3">
								<img src="/wp-content/uploads/2025/06/al_icon.svg">
								<p>News verson release 2.05</p>
								<h3>Defalut ui looking good  <br>  in our  <span>application</span></h3>
								<img src="/wp-content/uploads/2025/06/img_01-5.webp">
							</div>

						</div>

						<div class="swiper-slide">
							<div class="nd-benifits-item _4">
								<img src="/wp-content/uploads/2025/06/al_icon.svg">
								<p>News verson release 2.05</p>
								<h3>QR Code varification <br>  when you want to access</h3>
								<img src="/wp-content/uploads/2025/06/al_app_icon2-e1748241749314.webp">
							</div>
						</div>




					</div>
					<div class="swiper-button-next"><i class="fa-regular fa-chevron-right"></i></div>
					<div class="swiper-button-prev"><i class="fa-regular fa-chevron-left"></i></div>
				</div>
			</div>

		</div>
	</section>





	<section class="homenest__app-services__pricing">
		<div class="container pricing-wrapper">

			<!-- Left column: Introduction & toggle -->
			<div class="pricing-intro">
				<p class="pricing-subtitle">Easy procedure to install</p>
				<h2 class="pricing-title">What’s The <span><span class="text--gradient">Pricing</span></span> Plan <br> Includes Cost!</h2>

			</div>

			<!-- Right column: Pricing Cards -->
			<div class="pricing-card__container">
				<p class="text--gradient pricing-sale">
					Save 20%
				</p>
				<div class="pricing-cards">


					<!-- Card 1 -->
					<div class="pricing-card personal">
						<div class="badge">Best Value</div>
						<div class="card-icon">
							<img src="/wp-content/uploads/2025/06/apple-logo.webp" alt="Apple">
						</div>
						<h3 class="card-title">Personal</h3>
						<div class="card-price">
							<span class="price-amount text--gradient">$29</span>
							<span class="price-period">Monthly</span>
						</div>
						<ul class="card-features">
							<li>Economic Market Survey</li>
							<li>Hosting (Free first year)</li>
							<li>Financial Technology Services</li>
							<li>No overdraft fees. Ever.</li>
							<li>Up to 30% invested when you shop</li>
						</ul>
						<a href="#" class="btn-trial"><span>Liên hệ tư vấn miễn phí</span></a>
					</div>

					<!-- Card 2 -->
					<div class="pricing-card business">
						<div class="card-icon">
							<img src="/wp-content/uploads/2025/06/windows-logo.webp" alt="Windows">
						</div>
						<h3 class="card-title">Business</h3>
						<div class="card-price">
							<span class="price-amount text--gradient">$49</span>
							<span class="price-period">Monthly</span>
						</div>
						<ul class="card-features">
							<li>Economic Market Survey</li>
							<li>Hosting (Free first year)</li>
							<li>Financial Technology Services</li>
							<li>No overdraft fees. Ever.</li>
							<li>Up to 30% invested when you shop</li>
						</ul>
						<a href="#" class="btn-trial"><span>Liên hệ tư vấn miễn phí</span></a>
					</div>

				</div>
			</div>


		</div>
	</section>




	<section class="homenest__app-services__intigration">
		<div class="container">
			<div class="intigration-header">
				<p class="intigration-header-badge"><img src="/wp-content/uploads/2025/06/al_icon.svg"><span>Easy procedure to install</span></p>
				<h2 class="intigration-title">
					Our Softwere <span><span class="text--gradient">Intigration</span></span>
				</h2>
			</div>
			<div class="intigration-btn-see-video">
				<button>
					<i class="fa-thin fa-circle-play"></i>
					<span>Case study With Video</span>
				</button>
			</div>
		</div>

		<div class="intigration__st-marquee">
			<div class="intigration-marquee">
				<div class="intigration-container">
					<div class="intigration-item">
						<h3 class="text--gradient">capgemini</h3>
						<p>The App Store offers nearly 1.8 million apps all held to the highest privacy standards.</p>
						<a>Visit Website</a>
						<img src="/wp-content/uploads/2025/06/Capgemini_201x_logo.svg.webp">
					</div>
					<div class="intigration-item">
						<h3 class="text--gradient">paypal</h3>
						<p>The App Store offers nearly 1.8 million apps all held to the highest privacy standards.</p>
						<a>Visit Website</a>
						<img src="/wp-content/uploads/2025/06/PayPal_logo.svg.webp">
					</div>
					<div class="intigration-item">
						<h3 class="text--gradient">Walmart</h3>
						<p>The App Store offers nearly 1.8 million apps all held to the highest privacy standards.</p>
						<a>Visit Website</a>
						<img src="/wp-content/uploads/2025/06/Walmart_logo.svg.webp">
					</div>
					<div class="intigration-item">
						<h3 class="text--gradient">amazon s.</h3>
						<p>The App Store offers nearly 1.8 million apps all held to the highest privacy standards.</p>
						<a>Visit Website</a>
						<img src="/wp-content/uploads/2025/06/Amazon_Web_Services_Logo.svg.webp">
					</div>
				</div>
			</div>
		</div>

		<div class="intigration__nd-marquee">
			<div class="intigration-marquee">
				<div class="intigration-container">
					<div class="intigration-item">
						<h3 class="text--gradient">capgemini</h3>
						<p>The App Store offers nearly 1.8 million apps all held to the highest privacy standards.</p>
						<a>Visit Website</a>
						<img src="/wp-content/uploads/2025/06/Capgemini_201x_logo.svg.webp">
					</div>
					<div class="intigration-item">
						<h3 class="text--gradient">paypal</h3>
						<p>The App Store offers nearly 1.8 million apps all held to the highest privacy standards.</p>
						<a>Visit Website</a>
						<img src="/wp-content/uploads/2025/06/PayPal_logo.svg.webp">
					</div>
					<div class="intigration-item">
						<h3 class="text--gradient">Walmart</h3>
						<p>The App Store offers nearly 1.8 million apps all held to the highest privacy standards.</p>
						<a>Visit Website</a>
						<img src="/wp-content/uploads/2025/06/Walmart_logo.svg.webp">
					</div>
					<div class="intigration-item">
						<h3 class="text--gradient">amazon s.</h3>
						<p>The App Store offers nearly 1.8 million apps all held to the highest privacy standards.</p>
						<a>Visit Website</a>
						<img src="/wp-content/uploads/2025/06/Amazon_Web_Services_Logo.svg.webp">
					</div>
				</div>
			</div>
		</div>

	</section>




	<section class="homenest__app-services__testimonial">
		<div class="container">
			<div class="testimonial-header">
				<p class="testimonial-header-badge"><img src="/wp-content/uploads/2025/06/al_icon.svg"><span>Easy procedure to install</span></p>
				<h2 class="testimonial-title">
					Client's <span><span class="text--gradient">Testimonial</span></span>
				</h2>
			</div>

			<div class="testimonial-review">
				<div class="testimonial-main-avatar">
					<img src="">
				</div>

				<div class="testimonial-main-review">
					<img class="testimonial-background" src="/wp-content/uploads/2025/06/des_testimonial_bg-1.webp">
					<div class="testimonial-reviews">
						<div class="testimonial-review-content">
							<div class="testimonial-review-star"></div>
							<p class="testimonial-review-text"></p>
						</div>


						<div class="testimonial-review-info">
							<h3  class="testimonial-review-name"></h3>
							<p   class="testimonial-review-job"></p>
						</div>
					</div>
				</div>

				<?php
				$args = array(
					'post_type' => 'review',
					'post_status' => 'publish',
					'posts_per_page' => 4 // Lấy tất cả bài viết
				);

				$query = new WP_Query($args);

				if ($query->have_posts()) {
					while ($query->have_posts()) {
						$query->the_post();
						$featured_image = get_the_post_thumbnail_url(get_the_ID(), 'full');
						$post_slug = get_post_field('post_name', get_the_ID());
						$post_title = get_the_title();
						$post_content = get_the_content();
						$rating_star = get_field('rating_star'); // Lấy giá trị từ ACF field 'rating_star'
						$job = get_field('job'); // Lấy giá trị từ ACF field 'job'
				?>
				<div class="testimonial-sub-avatar" data-post-id="<?php echo esc_attr(get_the_ID()); ?>">
					<img data-slug="<?php echo esc_attr($post_slug); ?>" 
						 src="<?php echo esc_url($featured_image); ?>" 
						 alt="<?php echo esc_attr($post_title); ?>" 
						 class="hoverable"
						 data-featured-image="<?php echo esc_url($featured_image); ?>"
						 data-rating-star="<?php echo esc_attr($rating_star); ?>"
						 data-content="<?php echo esc_attr($post_content); ?>"
						 data-title="<?php echo esc_attr($post_title); ?>"
						 data-job="<?php echo esc_attr($job); ?>">
				</div>
				<?php
					}
					wp_reset_postdata();
				}
				?>

				<script>
					document.addEventListener('DOMContentLoaded', function() {
						const images = document.querySelectorAll('.testimonial-sub-avatar img.hoverable');

						// Hàm tạo HTML cho rating stars
						function getStarRatingHTML(rating) {
							const ratingNum = parseInt(rating) || 0;
							let starsHTML = '';
							for (let i = 1; i <= 5; i++) {
								if (i <= ratingNum) {
									starsHTML += '<i class="fa-solid fa-star"></i>';
								} else {
									starsHTML += '<i class="fa-regular fa-star"></i>';
								}
							}
							return starsHTML || 'No rating';
						}

						// Hàm xử lý fade in
						function applyFadeIn(element) {
							if (element) {
								element.classList.remove('fade-in');
								// Force reflow để reset animation
								void element.offsetWidth;
								element.classList.add('fade-in');
							}
						}

						// Hàm xử lý hover
						function handleHover(img) {
							console.log(img.getAttribute('data-slug'));

							// Get data attributes
							const featuredImage = img.getAttribute('data-featured-image');
							const ratingStar = img.getAttribute('data-rating-star');
							const content = img.getAttribute('data-content');
							const title = img.getAttribute('data-title');
							const job = img.getAttribute('data-job');

							// Update corresponding elements
							const mainAvatar = document.querySelector('.testimonial-main-avatar > img');
							const reviewStar = document.querySelector('.testimonial-review-star');
							const reviewText = document.querySelector('.testimonial-review-text');
							const reviewName = document.querySelector('.testimonial-review-name');
							const reviewJob = document.querySelector('.testimonial-review-job');

							if (mainAvatar) {
								mainAvatar.src = featuredImage;
								applyFadeIn(mainAvatar);
							}
							if (reviewStar) {
								reviewStar.innerHTML = getStarRatingHTML(ratingStar);
								applyFadeIn(reviewStar);
							}
							if (reviewText) {
								reviewText.textContent = content;
								applyFadeIn(reviewText);
							}
							if (reviewName) {
								reviewName.textContent = title;
								applyFadeIn(reviewName);
							}
							if (reviewJob) {
								reviewJob.textContent = job || 'No job specified';
								applyFadeIn(reviewJob);
							}
						}

						// Gắn sự kiện hover cho tất cả hình ảnh
						images.forEach(function(img) {
							img.addEventListener('mouseenter', function() {
								handleHover(this);
							});
						});

						// Tự động hover vào một phần tử ngẫu nhiên
						if (images.length > 0) {
							const randomIndex = Math.floor(Math.random() * images.length);
							const randomImage = images[randomIndex];
							const mouseEnterEvent = new Event('mouseenter');
							randomImage.dispatchEvent(mouseEnterEvent);
						}
					});
				</script>


			</div>

			<div class="testimonial-icons">
				<img src="/wp-content/uploads/2025/06/d_shape1-1.webp">
				<img src="/wp-content/uploads/2025/06/d_shape2-1.webp">
				<img src="/wp-content/uploads/2025/06/d_shape3-1.webp">
				<img src="/wp-content/uploads/2025/06/quote-1-1.svg">
				<img src="/wp-content/uploads/2025/06/Vector-1-1-2.webp">
			</div>
		</div>
	</section>





	<section class="homenest__app-services__thanks">
		<div class="container">
			<h2 class="text--gradient">
				2.0 updates
			</h2>
			<img class="emoji-1" src="/wp-content/uploads/2025/06/f_emoji-1.webp" style="--d: 0s">


			<div class="thanks-content">
				<img class="icon" src="/wp-content/uploads/2025/06/al_icon.svg">
				<p class="title text--gradient">
					Thanks
				</p>
				<p class="desc">
					For visiting our website
				</p>
			</div>


			<img class="emoji-2" src="/wp-content/uploads/2025/06/f_love.webp" style="--d: -1s">

			<h2 class="text--gradient">
				App landing
			</h2>

		</div>
	</section>










	<!-- Swiper JS -->
	<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>

	<!-- Initialize Swiper -->
	<script>
		document.addEventListener('DOMContentLoaded', function() {
			var swiperMobile = new Swiper(".swiperMobile", {
				loop: true,
				navigation: {
					nextEl: ".swiper-button-next",
					prevEl: ".swiper-button-prev",
				},
			});


			var swiperBrands = new Swiper(".swiperBrands", {
				slidesPerView: 2,
				spaceBetween: 30,
				loop: true,
				// 				autoplay: {
				// 					delay: 2000,
				// 					disableOnInteraction: false,
				// 				},
				breakpoints: {
					480: {
						slidesPerView: 3,
						spaceBetween: 20,
					},
					767: {
						slidesPerView: 4,
						spaceBetween: 20,
					},
					991: {
						slidesPerView: 5,
						spaceBetween: 20,
					},
					1200: {
						slidesPerView: 6,
						spaceBetween: 40,
					},
					1350: {
						slidesPerView: 6,
						spaceBetween: 50,
					},
				},
			});

			var swiperNdBenifits = new Swiper(".swiperNdBenifits", {

				slidesPerView: 1,
				spaceBetween: 30,
				loop: true,
				autoplay: {
					delay: 2000,
					disableOnInteraction: false,
				},
				navigation: {
					nextEl: ".swiper-button-next",
					prevEl: ".swiper-button-prev",
				},
				breakpoints: {

					480: {
						slidesPerView: 2,
						spaceBetween: 28,
					},
					991: {
						slidesPerView: 2,
						spaceBetween: 32,
					},
					1200: {
						slidesPerView: 3,
						spaceBetween: 28,
					},
					1350: {
						slidesPerView: 4,
						spaceBetween: 20,
					},
					1600: {
						slidesPerView: 4,
						spaceBetween: 28,
					},
				},
			});



			const marqueeItems = document.querySelectorAll('.intigration-marquee');
			marqueeItems.forEach(item => {
				const div = item.querySelector('.intigration-container');
				if (div) {
					// Lấy width và gán vào --width
					const width = div.offsetWidth;
					item.style.setProperty('--width', `${width}px`);

					// Sao chép phần tử div
					const divClone = div.cloneNode(true); // true để sao chép cả nội dung bên trong
					item.appendChild(divClone); // Thêm bản sao vào .marquee-item
				}
			});




		});

		document.addEventListener('DOMContentLoaded', function() {
			function updateXValues() {
				const elements = document.querySelectorAll('.homenest__app-services__app-container .app-preview .banner-body');
				const windowHeight = window.innerHeight;

				elements.forEach(element => {
					const rect = element.getBoundingClientRect();
					const elementY = rect.top;

					// Calculate scroll progress (from 100% to 50% of viewport height)
					const startPoint = windowHeight * 0.7; // 100% viewport height
					const endPoint = windowHeight * 0; // 50% viewport height

					if (elementY <= startPoint && elementY >= endPoint) {
						// Linear interpolation for smooth transition
						const progress = (startPoint - elementY) / (startPoint - endPoint);
						const xValue = (progress * 100) - 50; // Map progress (0 to 1) to -100 to 100
						element.style.setProperty('--x', `${xValue}px`);
					} else if (elementY > startPoint) {
						element.style.setProperty('--x', '-50px'); // Start at -100px
					} else if (elementY < endPoint) {
						element.style.setProperty('--x', '50px'); // End at 100px
					}
				});
			}

			// Run on page load
			updateXValues();

			// Run on scroll
			document.addEventListener('scroll', updateXValues);
		});


		document.addEventListener('DOMContentLoaded', function() {
			setTimeout(() => {
				document.querySelector('.banner-body').classList.add('active');
			}, 0);

		});



		document.addEventListener('DOMContentLoaded', function() {
			function updateXValues2() {
				const elements2 = document.querySelectorAll('.homenest__app-services__pricing .pricing-sale');
				const windowHeight2 = window.innerHeight;

				elements2.forEach(element2 => {
					const rect2 = element2.getBoundingClientRect();
					const elementY2 = rect2.top;

					// Calculate scroll progress (from 100% to 50% of viewport height)
					const startPoint2 = windowHeight2 * 1; // 100% viewport height
					const endPoint2 = windowHeight2 * 0; // 50% viewport height

					if (elementY2 <= startPoint2 && elementY2 >= endPoint2) {
						// Linear interpolation for smooth transition
						const progress2 = (startPoint2 - elementY2) / (startPoint2 - endPoint2);
						const xValue2 = -80 - (progress2 * 20); // Map progress (0 to 1) to -80% to -100%
						element2.style.setProperty('--x', `${xValue2}%`);
					} else if (elementY2 > startPoint2) {
						element2.style.setProperty('--x', '-80%'); // Start at -80%
					} else if (elementY2 < endPoint2) {
						element2.style.setProperty('--x', '-100%'); // End at -100%
					}
				});
			}

			// Run on page load
			updateXValues2();

			// Run on scroll
			document.addEventListener('scroll', updateXValues2);
		});



	</script>

</main>

<?php get_footer(); ?>
