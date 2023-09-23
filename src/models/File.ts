export default class File {
    constructor(   
        public filename: string | void, public blob: Blob) {
    }
    openFile = (): void => {
        let objectUrl = window.URL.createObjectURL(this.blob);
        window.open(objectUrl);
    }
}