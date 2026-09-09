/* =========================================
   KAWAII ANIME GALLERY
   INTERACTIVE JAVASCRIPT
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const cards = [...document.querySelectorAll(".art-card")];
    const categoryButtons = [...document.querySelectorAll(".category")];

    const searchInput = document.getElementById("searchInput");
    const clearSearch = document.getElementById("clearSearch");

    const noResults = document.getElementById("noResults");
    const resetGallery = document.getElementById("resetGallery");

    const randomArtBtn = document.getElementById("randomArtBtn");
    const heroSurpriseBtn = document.getElementById("heroSurpriseBtn");

    const modal = document.getElementById("artModal");
    const modalOverlay = document.getElementById("modalOverlay");
    const modalClose = document.getElementById("modalClose");

    const modalArt = document.getElementById("modalArt");
    const modalTag = document.getElementById("modalTag");
    const modalTitle = document.getElementById("modalTitle");
    const modalDescription = document.getElementById("modalDescription");
    const modalLike = document.getElementById("modalLike");


    /* =========================================
       CURRENT STATE
    ========================================= */

    let activeCategory = "all";
    let currentCard = null;


    /* =========================================
       CATEGORY FILTER
    ========================================= */

    function filterGallery() {

        const searchValue =
            searchInput.value.trim().toLowerCase();

        let visibleCount = 0;

        cards.forEach((card) => {

            const categories =
                card.dataset.category.toLowerCase();

            const title =
                card.dataset.title.toLowerCase();

            const description =
                card.dataset.description.toLowerCase();

            const searchableText =
                `${categories} ${title} ${description}`;

            const categoryMatch =
                activeCategory === "all" ||
                categories.includes(activeCategory);

            const searchMatch =
                searchValue === "" ||
                searchableText.includes(searchValue);

            if (categoryMatch && searchMatch) {

                card.style.display = "";

                requestAnimationFrame(() => {
                    card.classList.add("visible");
                });

                visibleCount++;

            } else {

                card.classList.remove("visible");
                card.style.display = "none";
            }

        });

        if (noResults) {
            noResults.style.display =
                visibleCount === 0 ? "block" : "none";
        }
    }


    /* =========================================
       CATEGORY BUTTONS
    ========================================= */

    categoryButtons.forEach((button) => {

        button.addEventListener("click", () => {

            categoryButtons.forEach((btn) => {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            activeCategory =
                button.dataset.filter.toLowerCase();

            filterGallery();

        });

    });


    /* =========================================
       SEARCH
    ========================================= */

    if (searchInput) {

        searchInput.addEventListener("input", () => {
            filterGallery();
        });


        /* ENTER KEY */

        searchInput.addEventListener("keydown", (event) => {

            if (event.key === "Enter") {

                event.preventDefault();

                filterGallery();

                searchInput.blur();

            }

        });

    }


    /* =========================================
       CLEAR SEARCH
    ========================================= */

    if (clearSearch) {

        clearSearch.addEventListener("click", () => {

            searchInput.value = "";

            filterGallery();

            searchInput.focus();

        });

    }


    /* =========================================
       RESET GALLERY
    ========================================= */

    if (resetGallery) {

        resetGallery.addEventListener("click", () => {

            activeCategory = "all";

            categoryButtons.forEach((button) => {

                button.classList.toggle(
                    "active",
                    button.dataset.filter === "all"
                );

            });

            searchInput.value = "";

            filterGallery();

            document
                .getElementById("gallery")
                .scrollIntoView({
                    behavior: "smooth"
                });

        });

    }


    /* =========================================
       OPEN ARTWORK MODAL
    ========================================= */

    function openModal(card) {

        currentCard = card;

        const image =
            card.querySelector(".art-image");

        const title =
            card.dataset.title;

        const description =
            card.dataset.description;

        const tag =
            card.querySelector(".art-tag")?.textContent ||
            "✦ KAWAII ART ✦";


        modalArt.innerHTML = image.innerHTML;

        modalTitle.textContent = title;

        modalDescription.textContent =
            description;

        modalTag.textContent = tag;


        /* Copy the visual scene class */

        modalArt.className =
            "modal-art " +
            [...image.classList]
                .filter(className =>
                    className !== "art-image"
                )
                .join(" ");


        /* Sync like button */

        updateModalLike();


        modal.classList.add("show");

        document.body.style.overflow = "hidden";

    }


    /* =========================================
       CLOSE MODAL
    ========================================= */

    function closeModal() {

        modal.classList.remove("show");

        document.body.style.overflow = "";

        currentCard = null;

    }


    if (modalClose) {
        modalClose.addEventListener(
            "click",
            closeModal
        );
    }


    if (modalOverlay) {
        modalOverlay.addEventListener(
            "click",
            closeModal
        );
    }


    /* ESC KEY */

    document.addEventListener("keydown", (event) => {

        if (
            event.key === "Escape" &&
            modal.classList.contains("show")
        ) {
            closeModal();
        }

    });


    /* =========================================
       ART CARD CLICK
    ========================================= */

    cards.forEach((card) => {

        card.addEventListener("click", (event) => {

            /* Don't open modal when heart is clicked */

            if (
                event.target.closest(".like-button")
            ) {
                return;
            }

            openModal(card);

        });

    });


    /* =========================================
       LIKE SYSTEM
    ========================================= */

    cards.forEach((card) => {

        const likeButton =
            card.querySelector(".like-button");

        if (!likeButton) return;


        likeButton.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();

                card.classList.toggle("liked");

                likeButton.classList.toggle(
                    "liked"
                );

                likeButton.textContent =
                    likeButton.classList.contains("liked")
                        ? "♥"
                        : "♡";


                /* Save like */

                const title =
                    card.dataset.title;

                localStorage.setItem(
                    `kawaii-like-${title}`,
                    likeButton.classList.contains("liked")
                );

            }
        );


        /* Restore previous like */

        const saved =
            localStorage.getItem(
                `kawaii-like-${card.dataset.title}`
            );

        if (saved === "true") {

            card.classList.add("liked");

            likeButton.classList.add("liked");

            likeButton.textContent = "♥";

        }

    });


    /* =========================================
       MODAL LIKE
    ========================================= */

    function updateModalLike() {

        if (!currentCard) return;

        const cardLike =
            currentCard.querySelector(".like-button");

        const isLiked =
            cardLike.classList.contains("liked");


        modalLike.textContent =
            isLiked
                ? "♥ Liked"
                : "♡ Like this artwork";

    }


    if (modalLike) {

        modalLike.addEventListener(
            "click",
            () => {

                if (!currentCard) return;

                const cardLike =
                    currentCard.querySelector(".like-button");

                cardLike.click();

                updateModalLike();

            }
        );

    }


    /* =========================================
       RANDOM ART
    ========================================= */

    function showRandomArtwork() {

        const visibleCards =
            cards.filter(
                card =>
                    card.style.display !== "none"
            );


        if (visibleCards.length === 0) {

            /* If search has no result,
               reset first */

            searchInput.value = "";

            activeCategory = "all";

            categoryButtons.forEach(
                button => {

                    button.classList.toggle(
                        "active",
                        button.dataset.filter === "all"
                    );

                }
            );

            filterGallery();

            return;

        }


        const randomIndex =
            Math.floor(
                Math.random() *
                visibleCards.length
            );

        const randomCard =
            visibleCards[randomIndex];


        randomCard.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });


        randomCard.classList.add(
            "random-highlight"
        );


        setTimeout(() => {

            randomCard.classList.remove(
                "random-highlight"
            );

            openModal(randomCard);

        }, 700);

    }


    if (randomArtBtn) {

        randomArtBtn.addEventListener(
            "click",
            showRandomArtwork
        );

    }


    if (heroSurpriseBtn) {

        heroSurpriseBtn.addEventListener(
            "click",
            showRandomArtwork
        );

    }


    /* =========================================
       NAV HEART
    ========================================= */

    const navHeart =
        document.querySelector(".nav-heart");

    if (navHeart) {

        navHeart.addEventListener(
            "click",
            () => {

                navHeart.textContent =
                    navHeart.textContent === "♡"
                        ? "♥"
                        : "♡";

                navHeart.classList.toggle(
                    "liked"
                );

            }
        );

    }


    /* =========================================
       SEARCH ICON / FOCUS
    ========================================= */

    const searchIcon =
        document.querySelector(".search-icon");

    if (searchIcon && searchInput) {

        searchIcon.addEventListener(
            "click",
            () => {
                searchInput.focus();
            }
        );

        searchIcon.style.cursor = "pointer";

    }


    /* =========================================
       CARD KEYBOARD ACCESS
    ========================================= */

    cards.forEach((card) => {

        card.setAttribute(
            "tabindex",
            "0"
        );

        card.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {

                    event.preventDefault();

                    openModal(card);

                }

            }
        );

    });


    /* =========================================
       INITIAL LOAD
    ========================================= */

    filterGallery();


    /* =========================================
       CONSOLE
    ========================================= */

    console.log(
        "🌸 Kawaii Anime Gallery loaded successfully!"
    );

});
