<?php

$wordlist = file("includes/wordlist.txt");



function genTitle(){
	global $wordlist;
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