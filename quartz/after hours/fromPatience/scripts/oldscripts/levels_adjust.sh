#! /bin/sh

# this script takes files from the 1_incoming directory and tells photoshop to open them
# should be called by launchd which will be watching the 1_incoming folder
# photoshop should be set to perform the action on open new document


for file in /Volumes/Patience/_after_hours/1_incoming/*.JPG
do
	/usr/bin/open -a /Applications/Adobe\ Photoshop\ CS2/Adobe\ Photoshop\ CS2.app/Contents/MacOS/Adobe\ Photoshop\ CS2 $file
	sleep 2
	mv $file /Volumes/Patience/_after_hours/2_incame/  2>&1 > /dev/null
done


#take care of pesky ds stores, ignore all output
find /Volumes/Patience/_after_hours/ -name .DS_Store -exec rm -f {} \;

sleep 60

#exit 0
