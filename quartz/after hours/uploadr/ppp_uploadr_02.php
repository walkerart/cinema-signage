#!/usr/bin/php

<?php
//include the library
include_once('phpFlickr/phpFlickr.php');
include_once('includes/functions.php');

$toUp = $argv[1];

if ($argv[1] == ""){
	echo "need to specify a file to upload!\n";
	exit;
}


//after hours group id
$ahGroupID = "67205906@N00";
$kwSetID = "72157594525204763";
$desc = "This is a test photo, playing with the flickr API. We're going to automatically upload photos during the Kara Walker After Hours Party.";
$tags = "walkerartcenter walkerafterhours art party flickrapi";


$myTitle = genTitle();

//auth and bein stuff for phpFlickr
$f = new phpFlickr('151828f594b0b1ea13157f381830c4f6','05504ae633dcb1e0');
$f->setToken("2059853-48fcc9a7f434fdfb");




// sync_upload ($photo, $title = null, $description = null, $tags = null, $is_public = null, $is_friend = null, $is_family = null)
$myPhotoID = $f->sync_upload($toUp, $myTitle, $desc, $tags);
echo "added photo, filename: ".$toUp."\t id: ".$myPhotoID."\t title: ".$myTitle."\n";


//group class setup
$g = new phpFlickr('151828f594b0b1ea13157f381830c4f6','05504ae633dcb1e0');
$g ->setToken("2059853-48fcc9a7f434fdfb");


echo "\t\tgoup add, filename: ".$toUp."\t";
if( $g->groups_pools_add($myPhotoID, $ahGroupID)){
	echo " ok";
} else{
	echo " FAILED!!!!";
}
echo "\n";



//set setup
$s = new phpFlickr('151828f594b0b1ea13157f381830c4f6','05504ae633dcb1e0');
$s ->setToken("2059853-48fcc9a7f434fdfb");


//var_dump($s->photosets_addPhoto($kwSetID, $myPhotoID));


echo "\t\tset add, filename: ".$toUp."\t";
if( $s->photosets_addPhoto($kwSetID, $myPhotoID)){
	echo " ok";
} else{
	echo " FAILED!!!!";
}
echo "\n";


//http://api.flickr.com/services/rest/?method=flickr.groups.pools.add&api_key=ffe69e97754ca633ca6ab7f0a0330482&photo_id=383997902&group_id=67205906%40N00&auth_token=2060005-af77490d8f37b9eb&api_sig=e22964ff65131e0007675625d07cfa9a







?>
