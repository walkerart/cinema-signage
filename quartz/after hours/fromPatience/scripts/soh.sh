#! /bin/sh

# takes photos that have been processed and uploads them to flickr, in seperate script

foriginal="/Users/justin.heideman/Desktop/BigDance/"


while true; do

	#projector original
	fols=`ls $foriginal`		

	#do projector original first
	if [ "$fols" != '' ] ; then
		for file in $foriginal*.JPG
		do
	
			echo "uploading " $file
			
			/usr/bin/php /Volumes/Patience/_after_hours/scripts/flickr_up.php "$file" 
						
			mv "$file" /Users/justin.heideman/Desktop/BigDanceOut/	
		done
	fi
	
	
	sleep 10
	
	#take care of pesky ds stores, ignore all output
	#find /Volumes/Patience/_after_hours/ -name .DS_Store -exec rm -f {} \;
done








