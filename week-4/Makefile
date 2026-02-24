some_file: other_file
	echo "this will always run, and runs second"
	touch some_file
other_file: 
	echo "this will always run, and run first"
.PHONY: clean
clean: 
	rm -f some_file
