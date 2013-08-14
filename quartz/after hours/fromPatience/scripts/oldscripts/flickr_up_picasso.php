
<?php

//include the library
include_once('phpFlickr/phpFlickr.php');

$toUp = $argv[1];
$picasso = $argv[2];

syslog(LOG_NOTICE,$argv[1]);

if ($argv[1] == ""){
	echo "need to specify a file to upload!\n";
	exit;
}
if ($argv[2] == ""){
	echo "need to specify picasso's file to upload!\n";
	exit;
}


//after hours group id
$ahGroupID = "67205906@N00";
$kwSetID = "72157600345104203";  //picasso's party people set
$desc = "";
$tags = "walkerartcenter walkerafterhours art party picasso";


$myTitle = genTitle();
//echo $myTitle;
//syslog(LOG_NOTICE, "the title: ".$myTitle);


//auth and bein stuff for phpFlickr
$f = new phpFlickr('151828f594b0b1ea13157f381830c4f6','05504ae633dcb1e0');
$f->setToken("2059853-48fcc9a7f434fdfb");




// sync_upload ($photo, $title = null, $description = null, $tags = null, $is_public = null, $is_friend = null, $is_family = null)
$myPhotoID = $f->sync_upload($toUp, genTitle(), $desc, $tags);
echo "added photo, filename: ".$toUp."\t id: ".$myPhotoID."\t title: ".$myTitle."\n";
//syslog(LOG_NOTICE,"added photo, filename: ".$toUp."\t id: ".$myPhotoID."\t title: ".$myTitle."\n");


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


/////////////////////////// functions /////////////////////

function genTitle($prepend=false){
	$wordlist = file("/Volumes/Patience/_after_hours/scripts/wordlist.txt");
	$count = count($wordlist)-1;  //count
	$w1 = $wordlist[rand(0,$count)];
	$w2 = $wordlist[rand(0,$count)];
	$title = trim($w1)." ".trim($w2)." Party People";  //join them up
	if (str_word_count($title) <= 3){
		echo "not long enough\n";
	}
	
	if ($prepend){  //add "picasso's 
		$title = "Picasso's ".$title;
	}
	
	return ucwords($title);   //title case
}

?>