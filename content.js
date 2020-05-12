var originalURL = window.location.origin;
var tribunSubString = 'tribunnews';
var idntimesSubString = 'idntimes';

if (originalURL.includes(tribunSubString) === true) {
	Tribunnews();
}
else if (originalURL.includes(idntimesSubString) === true) {
	console.log('belum diubah');
} else {
	console.log(window.href.original);
}

function Tribunnews() {
	// Navbar Components
	// Logo
	var TribunLogo = $(".tlogo");

	// Seacrh Bar Components
	var iconSeacrh = $('.fa.fa-search.fa-lg.mr10')[0];
	var searchText = $('.fbo2')[1];
	var searchHover = $('.submenu')[0];

	// Network Bar Components
	var networkHover = $('.submenu')[1];

	// Social Media Bar Components
	sosmedHover = $('.submenu')[2];

	// Annoying Ads
	var topAds = $('#div-Top-Leaderboard');
	var rightAds = $('#boxright');
	// End of Naavbar Components

	// News Category
	//

	// Article Components
	// Div inside content Components
	var divInsideContent = $('.baca');

	// Annoying Ads
	var firstAdsOnContent = $('#impulseadcontainer');
	var secondAdsOnContent = $('#div-BelowImages');
	var rightAdsContent = $('#div-Right-MediumRectangle-1');
	// End of Article Components

	// Function Show All Page
	const showPageAll = () => {
		var url_string = window.location.href;
		var url = new URL(url_string);
		var c = url.searchParams.get("page");

		if (document.location.href.indexOf('?page=') === -1) {
			window.location.replace(window.location.href + '?page=all');
		} else if (c === "2") {
			var get = document.location.href;
			var url = get.split("?", 1)
			window.location.replace(url + '?page=all');
		}
	}

	const removeElement = () => {
		/////////// Start Homepage Components
		// Navbar Components
		// Search Bar Components
		if (iconSeacrh != undefined) {
			iconSeacrh.remove();
		}
		if (searchText != undefined) {
			searchText.remove();
		}
		if (searchHover != undefined) {
			searchHover.remove();
		}

		// Network Bar Components
		if (networkHover != undefined) {
			networkHover.remove();
		}

		// Social Media Bar Components
		if (sosmedHover != undefined) {
			sosmedHover.remove();
		}

		// Annoying Ads
		if (topAds != undefined) {
			topAds.remove();
		}
		// End Homepage Components

		// Start Article Components
		// Content
		if (divInsideContent != undefined) {
			divInsideContent.remove();
		}

		// Annoying Ads
		if (firstAdsOnContent != undefined) {
			firstAdsOnContent.remove();
		}
		if (secondAdsOnContent != undefined) {
			secondAdsOnContent.remove();
		}
		if (rightAdsContent != undefined) {
			rightAdsContent.remove();
		}

	}

	const newFormSeacrh = () => {
		var newDiv = document.createElement('div');

		newDiv.className = 'searchform';

		newDiv.innerHTML = `<form action="https://www.tribunnews.com/search" id="cse-search-box"><label id="labelsearch" class="mr5 fbo1" for="#inputsearch"><a href="#inputsearch">Cari</a></label><input name="q" type="text" placeholder="Cari Berita" lang="id" id="inputsearch"><input type="hidden" name="cx" value="partner-pub-7486139053367666:4965051114"><input type="hidden" name="cof" value="FORID:10"><input type="hidden" name="ie" value="UTF-8"><input type="hidden" name="siteurl" value="www.tribunnews.com"><button type="submit" id="btnsearch"><i class="fa fa-search"></i></button><div class="cl"></div></form>`;
		var newElementSearch = $('.havc.search.blue');
		newElementSearch[0].appendChild(newDiv);
	}

	const SkipLinks = () => {
		var parentList = document.createElement('ul');
		parentList.className = 'skip-links';

		parentList.innerHTML = `<li><a href="#beritaUtama">Skip ke Berita Utama</a></<li><li><a href="#beritaTerbaru">Skip ke Berita Terbaru</a></li><li><a href="#topikPilihan">Skip ke Berita Pilihan</a></li>`;
		TribunLogo[0].appendChild(parentList);
	}

	const newsLabel = () => {
		var LatestNewsLabel = document.createElement('label');
		LatestNewsLabel.innerHTML = `Berita Terbaru`;
		LatestNewsLabel.id = 'beritaTerbaru';

		var HeadlineNewsLabel = document.createElement('label');
		HeadlineNewsLabel.innerHTML = `Berita Utama`;
		HeadlineNewsLabel.id = 'beritaUtama';

		var ChoosenNewsLabel = document.createElement('label');
		ChoosenNewsLabel.innerHTML = `Topik Pilihan`;
		ChoosenNewsLabel.id = 'topikPilihan';


		var parentLatestNewsLabel = $('.bsh.ovh')[1];
		var parentHeadlineNewsLabel = $('#headline');
		var parentChoosenNewslabel = $('#box2c');


		if (parentLatestNewsLabel != null) {
			$(LatestNewsLabel).insertBefore(parentLatestNewsLabel);
		}

		if (parentHeadlineNewsLabel != null) {
			$(HeadlineNewsLabel).insertBefore(parentHeadlineNewsLabel);
		}

		if (parentChoosenNewslabel != null) {
			$(ChoosenNewsLabel).insertBefore(parentChoosenNewslabel);
		}
	}

	const init = () => {
		showPageAll();
		removeElement();
		newFormSeacrh();
		SkipLinks();
		newsLabel();
	}

	init();
}