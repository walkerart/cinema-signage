#! /bin/sh

# scp/rsync them to the display machines


# bazinet
box1="aftergirl.local"
# mailroom
#box2="afterBoy.local"

original="/Volumes/Patience/_after_hours/3_togo/projector_orig/"
#picasso="/Volumes/Patience/_after_hours/3_togo/projector_picasso/"

while true; do

	#projector original
	pols=`ls $original`
	#projector picasso
	#ppls=`ls $picasso`
		


	#do projector original first
	if [ "$pols" != '' ] ; then
		for file in $original*.jpg
		do
	
			echo "copying " $file
			# scp to qtz display boxes here
			scp -q "$file" nmi@$box1:/Users/nmi/Pictures/
			#scp -q "$file" nmi@$box2:/Users/nmi/Pictures/
									
			mv "$file" /Volumes/Patience/_after_hours/4_gone/projector_orig/	
		done
	fi
	
	
#	if [ "$ppls" != '' ] ; then
#		for file in $picasso*.jpg
#		do
#	
#			# scp to qtz display boxes here
#			scp -q "$file" nmi@$box1:/Users/nmi/Pictures/picasso/
#			scp -q "$file" nmi@$box2:/Users/nmi/Pictures/picasso/
#						
#			mv "$file" /Volumes/Patience/_after_hours/4_gone/projector_picasso/		
#		done
#	fi
	
	sleep 10
	
	#take care of pesky ds stores, ignore all output
	#find /Volumes/Patience/_after_hours/ -name .DS_Store -exec rm -f {} \;
done




