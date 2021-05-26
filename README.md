Description:
App gets list of flights and displays flights status. It allows to paginate, search by id and sort data. Application is responsive

Additional functions:
1. Caching that prevents making http call for resources that already have been downloaded
2. Loading indicator that shows user when data is being downloaded
3. In app there are 2 interceptors for handling and displaying errors and showing loading indicator.

Additional information:
The search is done by searching for local data. There is an api to get record by specific id but here i also have to know date and code of plane which user can't know. 
That's why i decided to do it that way. Searchbar is reactive, i didn't use switch map because there is no http call ongoing.

Sorting is also done by sorting local data.

Testing:
I added 5 unit test cases. I used angular testing library to speed up process. It is done in a dom testing way. I decided to test it that way because it's more bulletproof.
It means that when someone change code implementation like number of arguments or split functions, test will still work.

To start app: ionic serve
To start tests: npm run test
