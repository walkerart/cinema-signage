#! /bin/sh

# scp/rsync them to the display machines
# takes photos that have been processed and uploads them to flickr, in seperate script

for file in /Volumes/Patience/_after_hours/3_togo/*.jpg
do
	
	# scp to qtz display box 1 here
	# scp to qtz display box 2 here


	/usr/bin/php /Volumes/Patience/_after_hours/scripts/flickr_up.php "$file"
	
	
	mv "$file" /Volumes/Patience/_after_hours/4_gone/
	
done

#take care of pesky ds stores
find /Volumes/Patience/_after_hours/ -name .DS_Store -exec rm -f {} \;

#sleep 60


#exit 0
