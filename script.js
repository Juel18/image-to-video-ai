const worker = new Worker('videoWorker.js');

async function generateVideo() {
    const images = document.getElementById('imageInput').files;
    if (images.length === 0) {
        alert("Please select images.");
        return;
    }

    let imageURLs = [];
    for (let img of images) {
        const imgURL = URL.createObjectURL(img);
        imageURLs.push(imgURL);
    }

    worker.postMessage({ images: imageURLs, fps: 5 });

    worker.onmessage = function (e) {
        if (e.data.status === "Done") {
            const webmURL = URL.createObjectURL(e.data.video);
            document.getElementById("outputVideo").src = webmURL;
            convertToMP4(e.data.video);
        }
    };
}

async function convertToMP4(webmBlob) {
    const { createFFmpeg, fetchFile } = FFmpeg;
    const ffmpeg = createFFmpeg({ log: true });

    await ffmpeg.load();
    ffmpeg.FS('writeFile', 'input.webm', await fetchFile(webmBlob));

    await ffmpeg.run('-i', 'input.webm', 'output.mp4');

    const mp4Data = ffmpeg.FS('readFile', 'output.mp4');
    const mp4Blob = new Blob([mp4Data.buffer], { type: 'video/mp4' });

    const mp4URL = URL.createObjectURL(mp4Blob);
    document.getElementById("outputVideo").src = mp4URL;

    const downloadLink = document.getElementById("downloadLink");
    downloadLink.href = mp4URL;
    downloadLink.download = "output.mp4";
    downloadLink.style.display = "block";
}
