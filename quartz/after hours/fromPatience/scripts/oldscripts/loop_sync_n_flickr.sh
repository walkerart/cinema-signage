#! /bin/sh

# scp/rsync them to the display machines
# takes photos that have been processed and uploads them to flickr, in seperate script

# bazinet
box1="afterBoy.local"
# mailroom
#box2="afterGirl.local"

while true; do

myls=`ls /Volumes/Patience/_after_hours/3_togo/`


	if [ "$myls" != '' ] ; then
		for file in /Volumes/Patience/_after_hours/3_togo/*.jpg
		do
			
			#echo "copying " $file
			# scp to qtz display boxes here
			scp -q "$file" nmi@$box1:/Users/nmi/Pictures/
			scp -q "$file" nmi@$box2:/Users/nmi/Pictures/
			
		
		
			/usr/bin/php /Volumes/Patience/_after_hours/scripts/flickr_up.php "$file"
			
			
			mv "$file" /Volumes/Patience/_after_hours/4_gone/
			
		done

	fi
	
	sleep 10
	#take care of pesky ds stores, ignore all output
	find /Volumes/Patience/_after_hours/ -name .DS_Store -exec rm -f {} \;
done




