#! /bin/sh

# takes photos that have been processed and uploads them to flickr, in seperate script

foriginal="/Volumes/Patience/_after_hours/3_togo/flickr_orig/"


while true; do

	#projector original
	fols=`ls $foriginal`		

	#do projector original first
	if [ "$fols" != '' ] ; then
		for file in $foriginal*.jpg
		do
	
			echo "uploading " $file
			
			/usr/bin/php /Volumes/Patience/_after_hours/scripts/flickr_up.php "$file" 
						
			mv "$file" /Volumes/Patience/_after_hours/4_gone/flickr_orig/	
		done
	fi
	
	
	sleep 10
	
	#take care of pesky ds stores, ignore all output
	#find /Volumes/Patience/_after_hours/ -name .DS_Store -exec rm -f {} \;
done








