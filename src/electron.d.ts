interface Electron {
    changeHostName: (templateData: TemplateData[]) => Promise<string>;
}

interface Window {
    electron: Electron;
}