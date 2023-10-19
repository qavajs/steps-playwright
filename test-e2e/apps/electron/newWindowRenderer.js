const button = document.querySelector('#closeCurrentWindow');
button.addEventListener('click', function () {
    window.electronAPI.closeCurrentWindow();
});
