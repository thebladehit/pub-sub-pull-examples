### Work in Parallel
```
[Uploader Service] ---> [Queue] ---> [Worker: Image Resizer]    
                            |
                            ---> [Worker: Image Resizer]
                            |
                            ---> [Worker: Image Resizer]
 ```