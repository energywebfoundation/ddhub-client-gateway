# Frontend environment variables
| KEY                         	             | TYPE             	 | DEFAULT VALUE 	 | ALLOWED VALUES 	              | DESCRIPTION                                                                 	     | DEPENDENCY KEY 	 |
|-------------------------------------------|--------------------|-----------------|-------------------------------|-----------------------------------------------------------------------------------|------------------|
| NEXT_PUBLIC_SERVER_BASE_URL 	             | Any string (URL) 	 | 	               | 	                             | 	                                                                                 | 	                |
| NEXT_PUBLIC_MOCK            	             | Boolean          	 | false         	 | Boolean        	              | Should mock DDHUB Client GW server. Use this only for development purposes.	      | 	                |
| NEXT_PUBLIC_SENTRY_ENABLED                | Boolean          	 | false         	 | Boolean        	              | 	                                                                                 | 	                |
| NEXT_PUBLIC_MESSAGING_OFFSET            	 | Number          	  | 10         	    | Any positive integer        	 | Minutes to be deducted from current datetime. Used in File Download get message.	 | 	                |
| NEXT_PUBLIC_MESSAGING_AMOUNT            	 | Number          	  | 100         	   | Any positive integer        	 | Amount of messages to retrieve. Used in File Download get message.	               | 	                |

