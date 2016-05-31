<?php 

header('Content-Type: text/cache-manifest');
header('Cache-Control: no-cache');

$fileNames = [
    'bundle.js',
    'index.html',
    'styles.css'
];

$files = [];
foreach($fileNames as $fileName){
    $files[md5_file(dirname(__FILE__).'/'.$fileName)] = $fileName;
}

$checksum = md5(implode('', array_keys($files)));

?>CACHE MANIFEST

# VERSION <?php echo $checksum; ?>

CACHE:
<?php
echo implode('
', $files);
?>


NETWORK:
*