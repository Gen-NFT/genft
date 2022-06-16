from os import walk, path, sep, environ
from requests import Session, Request


def pinata_upload(directory):
    # directory is the abs path of dir
    files = []
    ipfs_url = "https://api.pinata.cloud/pinning/pinFileToIPFS"
    headers = {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.146 Safari/537.36',
        'pinata_api_key': environ['PINATA_API_KEY'],
        'pinata_secret_api_key': environ['PINATA_SECRET_API_KEY']
    }
    # directory.split(sep)[-1] is the name of directory
    files.append(('pinataMetadata', (None, '{"name":"' + directory.split(sep)[-1] + '"}')))
    for root, dirs, files_ in walk(path.abspath(directory)):
        for f in files_:
            complete_path = path.join(root, f)
            # sep.join(complete_path.split(sep)[-2:]) create the name of file with the syntax directory/filename
            files.append(('file', (sep.join(complete_path.split(sep)[-2:]), open(complete_path, 'rb'))))
    request = Request(
        'POST',
        ipfs_url,
        headers=headers,
        files=files
    ).prepare()
    response = Session().send(request)
  
    return response.json()["IpfsHash"]


if __name__ == '__main__':
    pinata_upload("./generatedArts")