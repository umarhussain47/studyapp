import pdfplumber

def extract_text(file_object):
    text = ""
    # pdfplumber is smart enough to read the file object directly from memory
    with pdfplumber.open(file_object) as pdf:
        for page in pdf.pages:
            extracted_text = page.extract_text()
            if extracted_text:
                text += extracted_text + "\n"
    return text