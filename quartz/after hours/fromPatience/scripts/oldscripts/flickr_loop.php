#!/usr/bin/php
<?php
$foriginal = "/Volumes/Patience/_after_hours/3_togo/flickr_original/";
$fpicasso = "/Volumes/Patience/_after_hours/3_togo/flickr_picasso/";

//after hours group id
$ahGroupID = "67205906@N00";
$kwSetID = "72157600345104203";  //picasso's party people set
$desc = "";
$tags = "walkerartcenter walkerafterhours art party picasso";

include_once('phpFlickr/phpFlickr.php');

echo "\nstarting...\n";

while (true):
	$d = dir($foriginal);
	//echo "Handle: " . $d->handle . "\n";
	//echo "Path: " . $d->path . "\n";
	while (false !== ($entry = $d->read())) {
		if($entry!='.' && $entry!='..' && $entry!='.DS_Store') {
			$oFile = $foriginal.$entry; 
			$orig = explode('.',$entry);
			$pFile = $fpicasso . $orig[0]." copy.".$orig[1];  //build picasso file to upload 
			echo $oFile."\n";
			echo $pFile."\n";
			if (file_exists($pFile)){  //both files exist, now we can upload
				echo "files exists!\n";
				$title = genTitle();
				$picTitle = "Picasso's ".$title;
				addMyPhoto($oFile, $title);	  //original			
				addMyPhoto($pFile, $picTitle);  //non-original
				
				exec('mv \''.$oFile.'\' /Volumes/Patience/_after_hours/4_gone/flickr_original/');
				exec('mv  \''.$pFile.'\' /Volumes/Patience/_after_hours/4_gone/flickr_picasso/');
				sleep(2);
				$title = null;
				$picTitle = null;	
			} else {
				echo "files do not exist\n";
				sleep(10);
			}			
		} else{
			echo $d->read();
			
		}
	echo "no new files sleep\n";
	sleep(10);	
	}
	$d->close();





endwhile;

function addMyPhoto($toUp, $title){
	
	global $desc, $tags, $ahGroupID, $kwSetID;
	
	//------- UPLOAD PHOTO ---------
	$f = new phpFlickr('151828f594b0b1ea13157f381830c4f6','05504ae633dcb1e0');
	$f->setToken("2059853-48fcc9a7f434fdfb");
	//upload the first photo
	$myPhotoID = $f->sync_upload($toUp, $title, $desc, $tags);
	echo "added photo, filename: ".$toUp."\t id: ".$myPhotoID."\t title: ".$title."\n";
	
	
	//------- ADD TO GROUP ---------
	$g = new phpFlickr('151828f594b0b1ea13157f381830c4f6','05504ae633dcb1e0');
	$g ->setToken("2059853-48fcc9a7f434fdfb");
	
	echo "\t\tgoup add, filename: ".$toUp."\t";
	if( $g->groups_pools_add($myPhotoID, $ahGroupID)){
		echo " ok";
	} else{
		echo " FAILED!!!!\n";
		return false;
	}
	echo "\n";
	
	//------- ADD TO SET ---------
	$s = new phpFlickr('151828f594b0b1ea13157f381830c4f6','05504ae633dcb1e0');
	$s ->setToken("2059853-48fcc9a7f434fdfb");
	echo "\t\tset add, filename: ".$toUp."\t";
	if( $s->photosets_addPhoto($kwSetID, $myPhotoID)){
		echo " ok";
	} else{
		echo " FAILED!!!!\n";
		return false;
	}
	echo "\n";
	
	return true;
	
}



function genTitle(){
	$wordlist = file("/Volumes/Patience/_after_hours/scripts/wordlist.txt");
	$count = count($wordlist)-1;  //count
	$w1 = $wordlist[rand(0,$count)];
	$w2 = $wordlist[rand(0,$count)];
	$title = trim($w1)." ".trim($w2)." Party People";  //join them up
	if (str_word_count($title) <= 3){
		echo "not long enough\n";
	}
	return ucwords($title);   //title case
}



?>