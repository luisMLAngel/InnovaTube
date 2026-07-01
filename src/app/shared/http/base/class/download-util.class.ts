export class DownloadUtilClass {

  /**
   * @description Download a file.
   * @param blob
   * @param fileName
   * @param forceExtension
   */
  static download(blob: Blob, fileName: string, forceExtension?: string): void {
    let link: HTMLAnchorElement = document.createElement('a');
    link.download = `${fileName.toLowerCase().replaceAll(' ', '-')}.${ forceExtension ? forceExtension : blob.type.split('/')[1]}`;
    link.href = window.URL.createObjectURL(blob);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    link.remove();
  }

  /**
   * @description Download a file with content disposition.
   * @param blob
   * @param contentDisposition
   */
  static downloadWithContentDisposition(blob: Blob, contentDisposition: string): void {
    const [_, fileName]: RegExpExecArray = /filename="(.+?)"/.exec(contentDisposition)!;
    let link: HTMLAnchorElement = document.createElement('a');
    link.download = fileName;
    link.href = window.URL.createObjectURL(blob);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    link.remove();
  }

  /**
   * @description Download a file by string.
   * @param url
   * @param nombreArchivo
   */
  static downloadByString(url: string, nombreArchivo: string): void {
    const link: HTMLAnchorElement = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.download = nombreArchivo;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * @description Create an object URL.
   * @param blob
   */
  static createObjectURL(blob: Blob): string {
    return window.URL.createObjectURL(blob);
  }

}
