const worker = new Worker('videoWorker.js');

function generateVideo() {
    const images = document.getElementById('imageInput').files;
    if (images.length === 0) {
        alert("Please select images.");
        return;
    }

    let imageURLs = [];
    for (let img of images) {
        imageURLs.push(URL.createObjectURL(img));
    }

    document.getElementById("progressBar").value = 0;
    document.getElementById("progressText").innerText = "Processing... 0%";

    worker.postMessage({ images: imageURLs, fps: 5 });

    worker.onmessage = function (e) {
        if (e.data.status === "Processing frame...") {
            let progress = Math.floor((e.data.frame / imageURLs.length) * 100);
            document.getElementById("progressBar").value = progress;
            document.getElementById("progressText").innerText = `Processing... ${progress}%`;
        } else if (e.data.status === "Done") {
            document.getElementById("progressBar").value = 100;
            document.getElementById("progressText").innerText = "Completed!";
            
            const webmURL = URL.createObjectURL(e.data.video);
            document.getElementById("outputVideo").src = webmURL;
        }
    };
}
