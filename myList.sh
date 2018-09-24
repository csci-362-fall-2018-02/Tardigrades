#!/bin/bash
# Script for Tardigrades 

write_page()
{
	cat <<- _EOF_
	<html>
		<head>
			<title>
			CSCI 362 Tardigrades Script
			</title>
		</head>

		<body>
			<h1>Tardigrades Project</h1>
		</body>
	</html>
_EOF_
}

makedirectory()
{
	director=~/tardigrades/bin
	mkdir $directory
	echo $directory
	return $directory
}

usage()
{
	echo "HTML file is named script.html"
}

#move_file(filename)
#{
#
#}

#### Main

filename=~/myList.html
write_page > $filename
usage
