self.onmessage = async function (e) {
    const { images, fps } = e.data;

    const canvas = new OffscreenCanvas(800, 600);
    const ctx = canvas.getContext("2d");
    const stream = canvas.captureStream(fps);
    const mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm" });

    let chunks = [];
    mediaRecorder.ondataavailable = (event) => chunks.push(event.data);
    mediaRecorder.start();

    for (let i = 0; i < images.length; i++) {
        self.postMessage({ status: "Processing frame...", frame: i + 1 });

        const image = await loadImage(images[i]);
        ctx.drawImage(image, 0, 0, 800, 600);
        await new Promise(r => setTimeout(r, 1000 / fps));
    }

    mediaRecorder.stop();
    mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        self.postMessage({ status: "Done", video: blob });
    };
};

async function loadImage(url) {
    return new Promise((resolve) => {
        let img = new Image();
        img.src = url;
        img.onload = () => resolve(img);
    });
}
