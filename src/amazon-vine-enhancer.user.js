// ==UserScript==
// @name         Amazon Vine UI Enhancer
// @namespace    https://github.com/FiniteLooper/UserScripts
// @version      0.3
// @description  Minor UI improvements to browsing items on Amazon Vine
// @author       Chris Barr
// @homepageURL  https://github.com/FiniteLooper/UserScripts
// @updateURL    https://github.com/FiniteLooper/UserScripts/raw/main/src/amazon-vine-enhancer.user.js
// @match        https://www.amazon.com/vine/vine-items*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.com
// @grant        unsafeWindow
// @grant        GM_addStyle
// ==/UserScript==

(function () {
  "use strict";
  //Grab the body BG color in case any custom themes are applied to the site
  const bodyBgColor = getComputedStyle(document.body).backgroundColor;

  //grab the border color, style, and size
  const border = getComputedStyle(document.querySelector('[data-a-name="vine-items"]')).border;

  //=========================================================================
  //Slightly taller popup modal window to the ETV is always visible =========
  GM_addStyle(`.a-popover-modal-fixed-height{height: 550px !important;} .a-popover-inner{padding-bottom: 112px !important;}`);

  //=========================================================================
  //Side categories: bolded selected items and show nesting better ==========
  GM_addStyle(`
  a.selectedNode{font-weight: bold;}
  a.selectedNode:hover{color: inherit !important;}
  .child-node{
    padding-left: 10px;
    margin-left: 0;
    border-left: ${border};
  }
  `);

  //=========================================================================
  //Sticky footer pagination ================================================
  GM_addStyle(`#vvp-items-grid-container > [role="navigation"] {
    position:sticky;
    bottom:0;
    padding-top: 5px;
    background-color: ${bodyBgColor};
    border-top: ${border};
  }`);

  //=========================================================================
  //Sticky top bar with search ==============================================
  const selBtnAndSearch = `[data-a-name="vine-items"] .vvp-items-button-and-search-container`;
  const elBtnAndSearch = document.querySelector(selBtnAndSearch);
  GM_addStyle(`${selBtnAndSearch} {
    position: sticky;
    top: 0;
    z-index: 1;
    background-color: ${bodyBgColor};
    border-bottom: ${border};
  }`);

  //Steal the margin value and use it as padding instead for the header so we can have a colored BG
  const btnAndSearchStyles = getComputedStyle(elBtnAndSearch);
  elBtnAndSearch.style.padding = btnAndSearchStyles.margin;
  elBtnAndSearch.style.margin = "0 !important";

  //=========================================================================
  //Sticky side bar with categories =========================================
  const selCategories = `#vvp-browse-nodes-container`;
  const elCategories = document.querySelector(selCategories);
  GM_addStyle(`${selCategories} {
    align-self: start;
    position: sticky;
  }`);

  //Set the sticky top position of the categories to the height of the top bar
  //unless the categories are taller than the screen
  if (elCategories.offsetHeight + elBtnAndSearch.offsetHeight <= document.documentElement.clientHeight) {
    elCategories.style.top = `${elBtnAndSearch.offsetHeight}px`;
  }

  //=========================================================================
  //Pagination when left/right arrow keys are pressed =======================
  document.body.addEventListener("keyup", (ev) => {
    if (ev.key === "ArrowLeft") {
      const el = document.querySelector(".a-pagination li:first-child a");
      el.focus();
      el.click();
    } else if (ev.key === "ArrowRight") {
      const el = document.querySelector(".a-pagination li:last-child a");
      el.focus();
      el.click();
    }
  });
})();
