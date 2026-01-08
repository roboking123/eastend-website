import Link from "next/link";
import { content } from "@/constants/content";

export default function Footer() {
    const { about, explore, copyright } = content.footer;

    return (
        <footer className="bg-surface border-t border-border-base py-12">
            <div className="container-base">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* 簡介 */}
                    <div>
                        <h3 className="heading-item text-primary mb-4">
                            {about.title}
                        </h3>
                        <p className="text-muted text-sm leading-relaxed">
                            {about.description.map((line, index) => (
                                <span key={index}>
                                    {line}
                                    {index < about.description.length - 1 && <br />}
                                </span>
                            ))}
                        </p>
                    </div>

                    {/* 快速連結 */}
                    <div>
                        <h4 className="text-primary font-semibold mb-4">{explore.title}</h4>
                        <ul className="space-y-2">
                            {explore.links.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-muted text-sm hover:text-primary font-medium transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* 版權 */}
                    <div>
                        <h4 className="text-primary font-semibold mb-4">{copyright.title}</h4>
                        <p className="text-muted text-sm">
                            {copyright.text}
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
