# Quick File Server

Want to view a directory of text files on a host quickly without having to install a custom tool? Quick File Server to the rescue!

## Usage

1. Navigate to the directory you want to serve.
    
    ```bash
    cd /my/directory/of/files
    ```
    
1. Download the latest release HTML file
    
    ```bash
    curl -L https://github.com/watkinsmatthewp/quick-file-server/releases/download/0.0.1/index.html > index.html
    ```
    
1. Create a file, `dir.txt` with the files you want to view using the `ls- l` command.
    
    ```bash
    ls -l *.log > dir.txt
    ```
    
1. Fire up the server utility of your choice. For example, busybox running port 2000:
    
    ```bash
    sudo busybox httpd -f -p 200 -h ./
    ```
    
1. Navigate to that port on your host. You'll get a neat little web portal to check through the files.

    Example: https://my-host.example.com:200/
