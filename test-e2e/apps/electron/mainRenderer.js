const button = document.querySelector('#electronButton');
button.addEventListener('click', function () {
    window.electronAPI.openNewWindow();
});
