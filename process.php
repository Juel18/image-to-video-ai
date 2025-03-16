<?php
if (isset($_FILES["video"])) {
    $uploadDir = "uploads/";
    $filePath = $uploadDir . basename($_FILES["video"]["name"]);

    if (move_uploaded_file($_FILES["video"]["tmp_name"], $filePath)) {
        $outputFile = $uploadDir . "output.mp4";
        shell_exec("ffmpeg -i $filePath -c:v libx264 $outputFile");

        echo json_encode(["success" => true, "video" => $outputFile]);
    } else {
        echo json_encode(["success" => false, "error" => "Upload failed"]);
    }
}
?>
