from urllib.parse import quote, urlsplit
import html
import os
def fileFormatter(self, entries, path,):
    
        items = ""
        folderCount = 0
        fileCount = 0

        for name in entries:
            fullname = os.path.join(path, name)
            isFolder = os.path.isdir(fullname)

            # URL item
            href = quote(name, safe="")
            displayName = name

            if isFolder:
                href += "/"
                displayName += "/"
                folderCount += 1

                itemClass = "file-item is-folder"
                icon = "icon-folder"
                itemType = "Directory"

            else:
                fileCount += 1
                extension = os.path.splitext(name)[1].lower()

                # cek jenis file
                if name.startswith(".") or extension in (".cfg", ".ini", ".conf"):
                    icon = "icon-config"
                    itemType = "Config"

                elif extension == ".html":
                    icon = "icon-doc"
                    itemType = "WEB DOCUMENT"

                elif extension == ".php":
                    icon = "icon-php"
                    itemType = extension[1:].upper() + " File"

                elif extension in (".js", ".ts" ):
                    icon = "icon-js"
                    itemType = "WEB SCRIPT"

                elif extension in (".css", ".scss" ):
                    icon = "icon-style"
                    itemType = "WEB STYLE"

                elif extension in (".png", ".jpg", ".jpeg",".webp", ".gif"  ):
                    icon = "icon-gambar"
                    itemType = "Image"

                elif extension in (".mp4", ".mov", ".mkv", ".avi", ".webm"  ):
                    icon = "icon-video"
                    itemType = "Video"

                elif extension in (".mp3", ".wav", ".aac", ".flac", ".ogg", ".wma" ):
                    icon = "icon-sound"
                    itemType = "Sound"

                elif extension:
                    icon = "icon-file"
                    itemType = extension[1:].upper() + " File"

                else:
                    icon = "icon-file"
                    itemType = "File"

                itemClass = "file-item"

            items += f"""
            <li>
                <a class="{itemClass}" href="{href}">
                    <span class="item-name">
                        <svg class="icon">
                            <use href="#{icon}"></use>
                        </svg>
                        {html.escape(displayName)}
                    </span>
                    <span class="item-type">{html.escape(itemType)}</span>
                </a>
            </li>
            """
        currentPath = urlsplit(self.path).path

        if currentPath != "/":
            items = """
            <li>
                <a class="file-item" href="../">
                    <span class="item-name">
                        <svg class="icon">
                            <use href="#icon-up"></use>
                        </svg>
                        ../
                    </span>
                    <span class="item-type">Parent Dir</span>
                </a>
            </li>
            """ + items

        return currentPath, items, fileCount, folderCount

