// resources/js/components/rich-text-editor.tsx
import BulletList from '@tiptap/extension-bullet-list'; // 👈 Importamos explícitamente
import ListItem from '@tiptap/extension-list-item';
import OrderedList from '@tiptap/extension-ordered-list';
import Paragraph from '@tiptap/extension-paragraph';
import UnderlineExtension from '@tiptap/extension-underline';
import ImageExtension from '@tiptap/extension-image'; // 🌟 1. Importamos la extensión de imagen
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';


import { Bold, List, ListOrdered, Italic, UnderlineIcon, Image as ImageIcon } from 'lucide-react';
import { Button } from './ui/button';

export function RichTextEditor({ value, onChange }: { value: string, onChange: (html: string) => void }) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                // Desactivamos las listas del starter kit para usar las manuales
                bulletList: false,
                orderedList: false,
            }),
            BulletList,
            OrderedList,
            ListItem,
            Paragraph,
            UnderlineExtension,
            ImageExtension.configure({ // 🌟 2. Configuramos la extensión de imágenes
                HTMLAttributes: {
                    class: 'rounded-2xl max-w-full my-4 border border-gray-100 shadow-sm mx-auto block', // Estética para las fotos dentro del post
                },
            }),
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML()); // Enviamos el HTML al form de Inertia
        },
        // Agregamos 'prose prose-pink' para que Tailwind v4 le de estilo a las listas
        editorProps: {
            attributes: {
                class: 'prose prose-pink prose-sm max-w-none min-h-[150px] w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none [&_p]:my-0',
            },
        },
    });

    if (!editor) return null;


    // DEBUG: Esto te dirá en la consola de Firefox qué comandos tiene permitidos el editor
    console.log("Extensiones activas:", editor.extensionManager.extensions.map(e => e.name));
    console.log("¿Es posible hacer listas?:", editor.can().toggleBulletList());


    // 🌟 3. Función mágica para interceptar la foto, subirla a Laravel e insertarla
    const addImageInline = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';

        input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;

            // Armamos el contenedor de envío tradicional
            const formData = new FormData();
            formData.append('image', file);

            try {
                // Subimos de forma asíncrona a la mini-ruta de Laravel
                const response = await fetch(route('admin.posts.upload-inline'), {
                    method: 'POST',
                    body: formData,
                    headers: {
                        // Pasamos el token CSRF obligatorio de Laravel que Inertia suele inyectar en el DOM
                        'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    // 🌟 Inyectamos la etiqueta <img src="url-de-laravel" /> en la posición del cursor
                    editor.chain().focus().setImage({ src: data.url }).run();
                } else {
                    alert('Error al subir la imagen al servidor.');
                }
            } catch (error) {
                console.error('Error inlining image:', error);
            }
        };

        input.click(); // Dispara la ventana nativa de selección de archivos
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-1 p-1 border rounded-md bg-muted/50">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={editor.isActive('bold') ? 'bg-pink-100 text-pink-700' : ''}
                >
                    <Bold className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={editor.isActive('bulletList') ? 'bg-pink-100 text-pink-700' : ''}
                >
                    <List className="h-4 w-4" />
                </Button>

                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={editor.isActive('underline') ? 'bg-pink-100 text-pink-700' : ''}
                >
                    <UnderlineIcon className="h-4 w-4" />
                </Button>
                {/* 🌟 4. NUEVO BOTÓN: Insertar Imagen en el flujo de texto */}
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={addImageInline}
                    className="hover:bg-pink-50 hover:text-pink-700"
                    title="Insertar imagen en el texto"
                >
                    <ImageIcon className="h-4 w-4" />
                </Button>
            </div>
            <EditorContent editor={editor} />
        </div>
    );
}