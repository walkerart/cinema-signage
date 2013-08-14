#!/usr/bin/php
<?php

$incomingDir = "/Volumes/bluebox/10/";
$doneDir =  "/Volumes/Patience/_after_hours/2_incame";


while(true){

	unset($d);
	unset($c);
	unset($incomingFiles);
	unset($doneFiles);
	unset($theDiff);
	
	$d = dir($incomingDir);
	$incomingFiles = array();
	while (false !== ($entry = $d->read())) {
		if ($entry != '..' && $entry != '.' && $entry != '.DS_Store' && $entry != 'Thumbs.db' ){
			$incomingFiles[] = $entry;
		   // echo $entry;
		}
	}
	$d->close();
	
	
	$c = dir($doneDir);
	$doneFiles = array();
	while (false !== ($entry = $c->read())) {
		if ($entry != '..' && $entry != '.' && $entry != '.DS_Store'){
			$doneFiles[] = $entry;
		   // echo $entry;
		}
	}
	$c->close();
	
	//print_r($incomingFiles);
	//print_r($doneFiles);
	
	$theDiff = array_diff($incomingFiles, $doneFiles);
	
	//print_R($theDiff);
	
	foreach($theDiff as $picture){
		$fullPic = $incomingDir.$picture;
		echo "opening ".$fullPic."\n";
		exec('/usr/bin/open -a /Applications/Adobe\ Photoshop\ CS2/Adobe\ Photoshop\ CS2.app/Contents/MacOS/Adobe\ Photoshop\ CS2 '.$fullPic);
		sleep(5);
		echo "copying ".$fullPic."\n";
		exec('/bin/cp '.$fullPic.' '.$doneDir);
	}
	echo "sleeping for 10\n";
	sleep(10);
}

?>