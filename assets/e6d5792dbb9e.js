function changeCategoryInit(id) {
    const activeClass = id + '__button--active';
    const buttons = document.querySelectorAll('.' + id + '-navigation' + ' ' + '.' + id + '__button');

    const clearActiveClass = () => {
        buttons.forEach((button) => button.classList.remove(activeClass));
    };

    const showCategoryNews = (label = '') => {
        const news = document.querySelectorAll('.' + id + '-item');
        news.forEach((item) => {
            const itemLabel = item.dataset.label;
            if (!label) {
                item.style.display = 'flex';
            } else {
                if (itemLabel === label) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            }
        });
    };

    buttons.forEach((button) => {
        button.onclick = ((button) => {
            return () => {
                if (button.classList.contains(activeClass)) {
                    clearActiveClass();
                    button.classList.remove(activeClass);
                    showCategoryNews();
                } else {
                    clearActiveClass();
                    button.classList.add(activeClass);
                    showCategoryNews(button.dataset.label);
                }
            };
        })(button);
    });
}