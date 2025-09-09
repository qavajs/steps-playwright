const handleOpenNewWindow = require("./newWindow");

module.exports = [
    {
        label: 'Default',
        submenu: [
            {
                label: 'Open Page',
                click: () => {
                    handleOpenNewWindow()
                }
            }
        ]
    },
    {
        label: 'Test',
        submenu: [
            {
                label: 'Open Page',
                click: () => {
                    handleOpenNewWindow()
                }
            }
        ]
    },
    {
        label: 'Help',
        submenu: [
            {
                role: 'about',
            }
        ]
    }
];