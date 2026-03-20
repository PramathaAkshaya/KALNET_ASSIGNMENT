import zipfile
import xml.etree.ElementTree as ET

def read_docx(path):
    try:
        with zipfile.ZipFile(path, 'r') as zip_ref:
            # Extract word/document.xml
            with zip_ref.open('word/document.xml') as doc_xml:
                tree = ET.parse(doc_xml)
                root = tree.getroot()
                
                # Namespaces
                ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
                
                # Extract text
                texts = []
                for p in root.findall('.//w:p', ns):
                    p_texts = []
                    for t in p.findall('.//w:t', ns):
                        if t.text:
                            p_texts.append(t.text)
                    texts.append("".join(p_texts))
                return "\n".join(texts)
    except Exception as e:
        return f"Error: {e}"

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1:
        print(read_docx(sys.argv[1]))
    else:
        print("Usage: python read_docx.py <filepath>")
