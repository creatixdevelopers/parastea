(function ($) {
    "use strict";

    //Page cursors

    document.getElementsByTagName("body")[0].addEventListener("mousemove", function (n) {
        t.style.left = n.clientX + "px";
        t.style.top = n.clientY + "px";
        e.style.left = n.clientX + "px";
        e.style.top = n.clientY + "px";
        i.style.left = n.clientX + "px";
        i.style.top = n.clientY + "px";
    });
    let t = document.getElementById("cursor"),
        e = document.getElementById("cursor2"),
        i = document.getElementById("cursor3");

    function n(t) {
        e.classList.add("hover"), i.classList.add("hover")
    }

    function s(t) {
        e.classList.remove("hover"), i.classList.remove("hover")
    }

    s();
    for (let r = document.querySelectorAll(".hover-target"), a = r.length - 1; a >= 0; a--) {
        o(r[a])
    }

    function o(t) {
        t.addEventListener("mouseover", n), t.addEventListener("mouseout", s)
    }

    //Navigation
    let app = function () {
        let body = undefined;
        let menu = undefined;
        let menuItems = undefined;
        let init = function init() {
            body = document.querySelector('body');
            menu = document.querySelector('.menu-icon');
            menuItems = document.querySelectorAll('.nav__list-item');
            applyListeners();
        };
        let applyListeners = function applyListeners() {
            menu.addEventListener('click', function () {
                return toggleClass(body, 'nav-active');
            });
        };
        let toggleClass = function toggleClass(element, stringClass) {
            if (element.classList.contains(stringClass)) element.classList.remove(stringClass); else element.classList.add(stringClass);
        };
        init();
    }();
})(jQuery);

//process
let processSwiper = new Swiper('.process .swiper-container', {
    direction: 'vertical',
    loop: false,
    speed: 1600,
    pagination: '.swiper-pagination',
    paginationBulletRender: function (swiper, index, className) {
        let year = document.querySelectorAll('.swiper-slide')[index].getAttribute('data-year');
        return '<span class="' + className + '">' + year + '</span>';
    },
    paginationClickable: true,
    nextButton: '.swiper-button-next',
    prevButton: '.swiper-button-prev',
    breakpoints: {
        768: {
            direction: 'horizontal',
        }
    }
});

//CardStack
var StackCards = function (element) {
    this.element = element;
    this.items = this.element.getElementsByClassName("stack");
    this.scrollingListener = false;
    this.scrolling = false;
    initStackCardsEffect(this);
};

function initStackCardsEffect(element) {
    // use Intersection Observer to trigger animation
    var observer = new IntersectionObserver(stackCardsCallback.bind(element));
    observer.observe(element.element);
}

function stackCardsCallback(entries) {
    // Intersection Observer callback
    if (entries[0].isIntersecting) {
        // cards inside viewport - add scroll listener
        if (this.scrollingListener) return; // listener for scroll event already added
        stackCardsInitEvent(this);
    } else {
        // cards not inside viewport - remove scroll listener
        if (!this.scrollingListener) return; // listener for scroll event already removed
        window.removeEventListener("scroll", this.scrollingListener);
        this.scrollingListener = false;
    }
}

function stackCardsInitEvent(element) {
    element.scrollingListener = stackCardsScrolling.bind(element);
    window.addEventListener("scroll", element.scrollingListener);
}

function stackCardsScrolling() {
    if (this.scrolling) return;
    this.scrolling = true;
    window.requestAnimationFrame(animateStackCards.bind(this));
}

function animateStackCards() {
    var top = this.element.getBoundingClientRect().top;
    var offsetTop = 100,
        cardHeight = 300,
        marginY = 15;
    for (var i = 0; i < this.items.length; i++) {
        // cardTop/cardHeight/marginY are the css values for the card top position/height/Y offset
        var scrolling = offsetTop - top - i * (cardHeight + marginY);
        // debugger;
        if (scrolling > 0) {
            // card is fixed - we can scale it down
            this.items[i].setAttribute(
                "style",
                "transform: translateY(" +
                marginY * i +
                "px) scale(" +
                (cardHeight - scrolling * 0.05) / cardHeight +
                ");"
            );
        }
    }

    this.scrolling = false;
}

var stackCards = document.getElementsByClassName("card-deck-js");
var intersectionObserverSupported =
    "IntersectionObserver" in window && "IntersectionObserverEntry" in window;

if (stackCards.length > 0 && intersectionObserverSupported) {
    for (var i = 0; i < stackCards.length; i++) {
        new StackCards(stackCards[i]);
    }
}

jQuery(document).ready(function ($) {
    var animationDelay = 2500,
        barAnimationDelay = 3800,
        barWaiting = barAnimationDelay - 3000,
        lettersDelay = 50,
        typeLettersDelay = 150,
        selectionDuration = 500,
        typeAnimationDelay = selectionDuration + 800,
        revealDuration = 600,
        revealAnimationDelay = 1500;
    initHeadline();

    function initHeadline() {
        singleLetters($('.cd-headline.letters').find('b'));
        animateHeadline($('.cd-headline'));
    }

    function singleLetters($words) {
        $words.each(function () {
            var word = $(this),
                letters = word.text().split(''),
                selected = word.hasClass('is-visible');
            for (i in letters) {
                if (word.parents('.rotate-2').length > 0) letters[i] = '<em>' + letters[i] + '</em>';
                letters[i] = (selected) ? '<i class="in">' + letters[i] + '</i>' : '<i>' + letters[i] + '</i>';
            }
            var newLetters = letters.join('');
            word.html(newLetters);
        });
    }

    function animateHeadline($headlines) {
        var duration = animationDelay;
        $headlines.each(function () {
            var headline = $(this);
            if (headline.hasClass('loading-bar')) {
                duration = barAnimationDelay;
                setTimeout(function () {
                    headline.find('.cd-words-wrapper').addClass('is-loading')
                }, barWaiting);
            } else if (headline.hasClass('clip')) {
                var spanWrapper = headline.find('.cd-words-wrapper'),
                    newWidth = spanWrapper.width() + 10
                spanWrapper.css('width', newWidth);
            } else if (!headline.hasClass('type')) {
                var words = headline.find('.cd-words-wrapper b'),
                    width = 0;
                words.each(function () {
                    var wordWidth = $(this).width();
                    if (wordWidth > width) width = wordWidth;
                });
                headline.find('.cd-words-wrapper').css('width', width);
            }
            setTimeout(function () {
                hideWord(headline.find('.is-visible').eq(0))
            }, duration);
        });
    }

    function hideWord($word) {
        var nextWord = takeNext($word);
        if ($word.parents('.cd-headline').hasClass('type')) {
            var parentSpan = $word.parent('.cd-words-wrapper');
            parentSpan.addClass('selected').removeClass('waiting');
            setTimeout(function () {
                parentSpan.removeClass('selected');
                $word.removeClass('is-visible').addClass('is-hidden').children('i').removeClass('in').addClass('out');
            }, selectionDuration);
            setTimeout(function () {
                showWord(nextWord, typeLettersDelay)
            }, typeAnimationDelay);
        } else if ($word.parents('.cd-headline').hasClass('letters')) {
            var bool = ($word.children('i').length >= nextWord.children('i').length) ? true : false;
            hideLetter($word.find('i').eq(0), $word, bool, lettersDelay);
            showLetter(nextWord.find('i').eq(0), nextWord, bool, lettersDelay);
        } else if ($word.parents('.cd-headline').hasClass('clip')) {
            $word.parents('.cd-words-wrapper').animate({
                width: '2px'
            }, revealDuration, function () {
                switchWord($word, nextWord);
                showWord(nextWord);
            });
        } else if ($word.parents('.cd-headline').hasClass('loading-bar')) {
            $word.parents('.cd-words-wrapper').removeClass('is-loading');
            switchWord($word, nextWord);
            setTimeout(function () {
                hideWord(nextWord)
            }, barAnimationDelay);
            setTimeout(function () {
                $word.parents('.cd-words-wrapper').addClass('is-loading')
            }, barWaiting);
        } else {
            switchWord($word, nextWord);
            setTimeout(function () {
                hideWord(nextWord)
            }, animationDelay);
        }
    }

    function showWord($word, $duration) {
        if ($word.parents('.cd-headline').hasClass('type')) {
            showLetter($word.find('i').eq(0), $word, false, $duration);
            $word.addClass('is-visible').removeClass('is-hidden');
        } else if ($word.parents('.cd-headline').hasClass('clip')) {
            $word.parents('.cd-words-wrapper').animate({
                'width': $word.width() + 10
            }, revealDuration, function () {
                setTimeout(function () {
                    hideWord($word)
                }, revealAnimationDelay);
            });
        }
    }

    function hideLetter($letter, $word, $bool, $duration) {
        $letter.removeClass('in').addClass('out');
        if (!$letter.is(':last-child')) {
            setTimeout(function () {
                hideLetter($letter.next(), $word, $bool, $duration);
            }, $duration);
        } else if ($bool) {
            setTimeout(function () {
                hideWord(takeNext($word))
            }, animationDelay);
        }
        if ($letter.is(':last-child') && $('html').hasClass('no-csstransitions')) {
            var nextWord = takeNext($word);
            switchWord($word, nextWord);
        }
    }

    function showLetter($letter, $word, $bool, $duration) {
        $letter.addClass('in').removeClass('out');
        if (!$letter.is(':last-child')) {
            setTimeout(function () {
                showLetter($letter.next(), $word, $bool, $duration);
            }, $duration);
        } else {
            if ($word.parents('.cd-headline').hasClass('type')) {
                setTimeout(function () {
                    $word.parents('.cd-words-wrapper').addClass('waiting');
                }, 200);
            }
            if (!$bool) {
                setTimeout(function () {
                    hideWord($word)
                }, animationDelay)
            }
        }
    }

    function takeNext($word) {
        return (!$word.is(':last-child')) ? $word.next() : $word.parent().children().eq(0);
    }


    function switchWord($oldWord, $newWord) {
        $oldWord.removeClass('is-visible').addClass('is-hidden');
        $newWord.removeClass('is-hidden').addClass('is-visible');
    }

    var intro = $('.cd-intro');
    $('.cd-filter input').on('change', function (event) {
        var selected = $(event.target).attr('id')
        switch (selected) {
            case 'rotate-2':
                intro.load('content.html .rotate-2', function () {
                    initHeadline();
                });
                break;
        }
    });
});
