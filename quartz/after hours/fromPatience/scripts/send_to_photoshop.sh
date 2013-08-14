#! /bin/sh

# this script takes files from the 1_incoming directory and tells photoshop to open them
# should be called by launchd which will be watching the 1_incoming folder
# photoshop should be set to perform the action on open new document


while true; do

myls=`ls /Volumes/Patience/_after_hours/1_incoming/`


	if [ "$myls" != '' ] ; then
		for myFile in /Volumes/Patience/_after_hours/1_incoming/*.JPG
		do
			/usr/bin/open -a /Applications/Adobe\ Photoshop\ CS2/Adobe\ Photoshop\ CS2.app/Contents/MacOS/Adobe\ Photoshop\ CS2 $myFile
			
			sleep 2 
			mv $myFile /Volumes/Patience/_after_hours/2_incame/  2>&1 > /dev/null
			sleep 10
		done
	else
		sleep 10
	fi
	#sleep 10
	#take care of pesky ds stores and Thumbs.db, ignore all output
	find /Volumes/Patience/_after_hours/ -name .DS_Store -exec rm -f {} \;
	find /Volumes/Patience/_after_hours/ -name Thumbs.db -exec rm -f {} \;
	find /Volumes/bluebox/08/ -name Thumbs.db -exec rm -f {} \;
	find /Volumes/bluebox/08/ -name .DS_Store -exec rm -f {} \;
done

