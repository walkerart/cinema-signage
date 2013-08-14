#!/usr/bin/php

<?php


ini_set("include_path",".:/usr/lib/php");

require_once 'Flickr/API.php';


	# create a new api object

	$api =& new Flickr_API(array('api_key'  => '151828f594b0b1ea13157f381830c4f6',));


	# call a method
	$response = $api->callMethod('flickr.test.echo', array('foo' => 'bar',));


	# check the response

	if ($response){	//response is an XML_Tree root object
		
		print_r($response);
	}else{
		# fetch the error
		$code = $api->getErrorCode();
		$message = $api->getErrorMessage();
	}


//http://flickr.com/services/auth/?api_key=151828f594b0b1ea13157f381830c4f6&perms=write&api_sig=4776f6df3a69460c64c0041c793b328d


//05504ae633dcb1e0api_key151828f594b0b1ea13157f381830c4f6permswrite
//permswrite


//echo md5("05504ae633dcb1e0api_key151828f594b0b1ea13157f381830c4f6permswrite");
?>