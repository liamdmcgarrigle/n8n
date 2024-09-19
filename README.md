# Bugs/Development
> 🛑 This is currently a prototype that is not ready for production. 🛑

In my rush to release this for the n8n community event on September 18th, I released it before I normally would, with a few fatal bugs.

## List of Bugs (in order of importance)
- Evaluation nodes will become disconnected after any non-unit-test test run.
- Only one output branch on the evaluation node will run
  - Without using an easy workaround
- Unit test will not run as expected if run from the node details screen in the evaluation node

## List of Important Features To Be Added
- Make the button that hides the unit tests functional
- Slightly modify the n8n logo to distinguish this as a community beta
- Add a node that can run unit tests in other workflows
- Add test metadata to errors for the error on fail feature

## Other Feature Ideas
- Automatically swap regular creds with test env creds
- Get Boolean evaluation mode working
  - Where there are two inputs, one for pass and one for fail
- Have matching IDs automatically generated when the trigger is placed
- Add GitHub-style test indicators in the top toolbar menu
- Add a button in the node submenu that adds a unit test properly placed around the node
- Add to n8n's current translation framework so the text is localized 

# How To Use
To use this version of n8n with unit tests, simply use my public docker image `liammcgarrigle/n8n-with-unit-tests` in any docker command that normally works with n8n's docker image.

Docker Run:
```
docker volume create n8n_data

docker run -it --rm --name n8n -p 5678:5678 -v n8n_data:/home/node/.n8n liammcgarrigle/n8n-with-unit-tests
```
Docker Compose (with clipped file):  \
*docker-compose.yaml*
```yaml
...
n8n:
    image: liammcgarrigle/n8n-with-unit-tests
    restart: always
    ports:
...
```
