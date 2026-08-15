import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { ShoppingCart } from 'lucide-react';
import { SafeHtml } from './safe-html';

export default function ProductCard({ product }: { product: any }) {
    console.log('Rendering ProductCard for:', product);

    const calculatePrice = () => {
        let price = 0;

        if (!product.is_customizable) {
            price = Number(product.price);
        } else {
            if (product.default_options && product.default_options.length > 0) {
                price = product.default_options.reduce((total: number, option: any) => {
                    // console.log('option:', option);
                    return total + Number(option.additional_price);
                }, 0);
            }
        }
        // console.log('Calculated price for product', product.name, ':', price);

        return price.toLocaleString('es-AR');
    }
    // calculatePrice();
    // alert(calculatePrice());

    // setProductPrice(calculatePrice());
    // const productPrice = !product.is_customizable ? Number(product.price).toLocaleString('es-AR') : 'ver precio...';

    return (
        <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm transition-all hover:shadow-xl">
            {/* Imagen con Zoom al hacer Hover */}
            <div className="relative aspect-square overflow-hidden bg-neutral-100">

                <Link href={route('products.show', product.slug)}>
                    <img
                        src={`${product.image?.includes('demo') ? product.image : `/storage/${product.image}`}`}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                </Link>
                {/* Badge de Categoría */}
                <span className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-pasteleria-rosa backdrop-blur-sm">
                    {product.category.name}
                </span>
            </div>

            {/* Contenido */}
            <div className="flex flex-1 flex-col p-5">
                <h3 className="text-lg font-bold text-neutral-800">{product.name}</h3>



                {/* <p className="mt-1 text-sm text-neutral-500 line-clamp-2">{product.description}</p> */}
                <p className="mt-1 text-sm text-neutral-500 line-clamp-2">
                    <SafeHtml html={product.description} />
                </p>

                <div className="mt-auto pt-4 flex items-center justify-between">
                    <span className="text-xl font-bold text-pasteleria-rosa">
                        {
                            // product.is_customizable ? Number(product.price).toLocaleString('es-AR') : 'ver precio...'
                        }
                        {/* ${Number(product.price).toLocaleString('es-AR')} */}
                        ${calculatePrice()}
                    </span>

                    <button className="flex h-10 w-10 items-center justify-center rounded-full bg-pasteleria-rosa text-white transition-transform hover:scale-110 active:scale-90 shadow-md">
                        <ShoppingCart size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}