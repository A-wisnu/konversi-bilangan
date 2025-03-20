import time
import os

# Kode warna ANSI untuk terminal
class Warna:
    MERAH = '\033[91m'
    HIJAU = '\033[92m'
    KUNING = '\033[93m'
    BIRU = '\033[94m'
    MAGENTA = '\033[95m'
    CYAN = '\033[96m'
    PUTIH = '\033[97m'
    RESET = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

def clear_screen():
    """Fungsi untuk membersihkan layar terminal"""
    os.system('cls' if os.name == 'nt' else 'clear')

def validasi_biner(bilangan):
    """Validasi bilangan biner yang dimasukkan pengguna"""
    try:
        # Periksa apakah hanya terdiri dari 0 dan 1
        for digit in bilangan:
            if digit != '0' and digit != '1':
                return False
        return True
    except:
        return False

def validasi_oktal(bilangan):
    """Validasi bilangan oktal yang dimasukkan pengguna"""
    try:
        # Periksa apakah hanya terdiri dari 0-7
        for digit in bilangan:
            if digit not in '01234567':
                return False
        return True
    except:
        return False

def validasi_heksadesimal(bilangan):
    """Validasi bilangan heksadesimal yang dimasukkan pengguna"""
    try:
        # Periksa apakah hanya terdiri dari 0-9 dan A-F (tidak case sensitive)
        for digit in bilangan.upper():
            if digit not in '0123456789ABCDEF':
                return False
        return True
    except:
        return False

def validasi_desimal(bilangan):
    """Validasi bilangan desimal yang dimasukkan pengguna"""
    try:
        int(bilangan)
        return True
    except:
        return False

def tampilkan_header():
    """Menampilkan header program yang berisi ASCII art dan kredit pembuat"""
    print(f"{Warna.CYAN}")
    ascii_art = '''
    ╔════════════════════════════════════════════════════════════════╗
    ║                                                                ║
    ║  ██╗    ██╗ ██╗ ███████╗ ███╗   ██╗ ██╗   ██╗                 ║
    ║  ██║    ██║ ██║ ██╔════╝ ████╗  ██║ ██║   ██║                 ║
    ║  ██║ █╗ ██║ ██║ ███████╗ ██╔██╗ ██║ ██║   ██║                 ║
    ║  ██║███╗██║ ██║ ╚════██║ ██║╚██╗██║ ██║   ██║                 ║
    ║  ╚███╔███╔╝ ██║ ███████║ ██║ ╚████║ ╚██████╔╝                 ║
    ║   ╚══╝╚══╝  ╚═╝ ╚══════╝ ╚═╝  ╚═══╝  ╚═════╝                  ║
    ║                                                                ║
    ╚════════════════════════════════════════════════════════════════╝
    '''
    print(ascii_art)
    
    print(f"{Warna.KUNING}{Warna.BOLD}")
    kredit = f'''
    ╔════════════════════════════════════════════════════════════════╗
    ║                                                                ║
    ║     dibuat oleh wisnu hidayat mahasiswa unisnu jepara          ║
    ║     teknik informatika guna memenuhi tugas                     ║
    ║     dengan nim 231240001422                                    ║
    ║                                                                ║
    ╚════════════════════════════════════════════════════════════════╝
    '''
    print(kredit)
    print(f"{Warna.RESET}")

def biner_ke_lainnya():
    """Konversi bilangan biner ke desimal, oktal, dan heksadesimal"""
    while True:
        clear_screen()
        tampilkan_header()
        
        print(f"\n{Warna.MAGENTA}╔════════════════════════════════════╗")
        print(f"║ KONVERSI BINER KE SISTEM LAIN    ║")
        print(f"╚════════════════════════════════════╝{Warna.RESET}")
        
        bilangan_biner = input(f"\n{Warna.CYAN}Masukkan bilangan biner: {Warna.RESET}")
        
        if not validasi_biner(bilangan_biner):
            print(f"\n{Warna.MERAH}[!] Input tidak valid! Bilangan biner hanya boleh terdiri dari 0 dan 1.{Warna.RESET}")
            time.sleep(2)
            continue
        
        # Konversi ke desimal terlebih dahulu
        desimal = int(bilangan_biner, 2)
        
        # Konversi ke sistem lainnya
        oktal = oct(desimal)[2:]  # Hilangkan prefix '0o'
        heksadesimal = hex(desimal)[2:]  # Hilangkan prefix '0x'
        
        print(f"\n{Warna.HIJAU}╔════════════════════════════════════╗")
        print(f"║         HASIL KONVERSI           ║")
        print(f"╠════════════════════════════════════╣")
        print(f"║ Biner \t\t: {bilangan_biner}")
        print(f"║ Desimal \t: {desimal}")
        print(f"║ Oktal \t\t: {oktal}")
        print(f"║ Heksadesimal \t: {heksadesimal.upper()}")
        print(f"╚════════════════════════════════════╝{Warna.RESET}")
        
        break

def desimal_ke_lainnya():
    """Konversi bilangan desimal ke biner, oktal, dan heksadesimal"""
    while True:
        clear_screen()
        tampilkan_header()
        
        print(f"\n{Warna.MAGENTA}╔════════════════════════════════════╗")
        print(f"║ KONVERSI DESIMAL KE SISTEM LAIN  ║")
        print(f"╚════════════════════════════════════╝{Warna.RESET}")
        
        bilangan_desimal = input(f"\n{Warna.CYAN}Masukkan bilangan desimal: {Warna.RESET}")
        
        if not validasi_desimal(bilangan_desimal):
            print(f"\n{Warna.MERAH}[!] Input tidak valid! Masukkan angka desimal yang benar.{Warna.RESET}")
            time.sleep(2)
            continue
        
        desimal = int(bilangan_desimal)
        
        # Konversi ke sistem lainnya
        biner = bin(desimal)[2:]  # Hilangkan prefix '0b'
        oktal = oct(desimal)[2:]  # Hilangkan prefix '0o'
        heksadesimal = hex(desimal)[2:]  # Hilangkan prefix '0x'
        
        print(f"\n{Warna.HIJAU}╔════════════════════════════════════╗")
        print(f"║         HASIL KONVERSI           ║")
        print(f"╠════════════════════════════════════╣")
        print(f"║ Desimal \t: {desimal}")
        print(f"║ Biner \t\t: {biner}")
        print(f"║ Oktal \t\t: {oktal}")
        print(f"║ Heksadesimal \t: {heksadesimal.upper()}")
        print(f"╚════════════════════════════════════╝{Warna.RESET}")
        
        break

def oktal_ke_lainnya():
    """Konversi bilangan oktal ke biner, desimal, dan heksadesimal"""
    while True:
        clear_screen()
        tampilkan_header()
        
        print(f"\n{Warna.MAGENTA}╔════════════════════════════════════╗")
        print(f"║ KONVERSI OKTAL KE SISTEM LAIN    ║")
        print(f"╚════════════════════════════════════╝{Warna.RESET}")
        
        bilangan_oktal = input(f"\n{Warna.CYAN}Masukkan bilangan oktal: {Warna.RESET}")
        
        if not validasi_oktal(bilangan_oktal):
            print(f"\n{Warna.MERAH}[!] Input tidak valid! Bilangan oktal hanya boleh terdiri dari 0-7.{Warna.RESET}")
            time.sleep(2)
            continue
        
        # Konversi ke desimal terlebih dahulu
        desimal = int(bilangan_oktal, 8)
        
        # Konversi ke sistem lainnya
        biner = bin(desimal)[2:]  # Hilangkan prefix '0b'
        heksadesimal = hex(desimal)[2:]  # Hilangkan prefix '0x'
        
        print(f"\n{Warna.HIJAU}╔════════════════════════════════════╗")
        print(f"║         HASIL KONVERSI           ║")
        print(f"╠════════════════════════════════════╣")
        print(f"║ Oktal \t\t: {bilangan_oktal}")
        print(f"║ Biner \t\t: {biner}")
        print(f"║ Desimal \t: {desimal}")
        print(f"║ Heksadesimal \t: {heksadesimal.upper()}")
        print(f"╚════════════════════════════════════╝{Warna.RESET}")
        
        break

def heksadesimal_ke_lainnya():
    """Konversi bilangan heksadesimal ke biner, desimal, dan oktal"""
    while True:
        clear_screen()
        tampilkan_header()
        
        print(f"\n{Warna.MAGENTA}╔════════════════════════════════════╗")
        print(f"║ KONVERSI HEKSA KE SISTEM LAIN    ║")
        print(f"╚════════════════════════════════════╝{Warna.RESET}")
        
        bilangan_heksa = input(f"\n{Warna.CYAN}Masukkan bilangan heksadesimal: {Warna.RESET}")
        
        if not validasi_heksadesimal(bilangan_heksa):
            print(f"\n{Warna.MERAH}[!] Input tidak valid! Bilangan heksadesimal hanya boleh terdiri dari 0-9 dan A-F.{Warna.RESET}")
            time.sleep(2)
            continue
        
        # Konversi ke desimal terlebih dahulu
        desimal = int(bilangan_heksa, 16)
        
        # Konversi ke sistem lainnya
        biner = bin(desimal)[2:]  # Hilangkan prefix '0b'
        oktal = oct(desimal)[2:]  # Hilangkan prefix '0o'
        
        print(f"\n{Warna.HIJAU}╔════════════════════════════════════╗")
        print(f"║         HASIL KONVERSI           ║")
        print(f"╠════════════════════════════════════╣")
        print(f"║ Heksadesimal \t: {bilangan_heksa.upper()}")
        print(f"║ Biner \t\t: {biner}")
        print(f"║ Desimal \t: {desimal}")
        print(f"║ Oktal \t\t: {oktal}")
        print(f"╚════════════════════════════════════╝{Warna.RESET}")
        
        break

def tampilkan_menu():
    """Menampilkan menu utama program"""
    clear_screen()
    tampilkan_header()
    
    menu = f'''
    {Warna.BIRU}╔════════════════════════════════════════════════════════════════╗
    ║{Warna.BOLD}                   MENU UTAMA PROGRAM                         {Warna.RESET}{Warna.BIRU}║
    ╠════════════════════════════════════════════════════════════════╣
    ║ {Warna.KUNING}[1]{Warna.RESET}{Warna.BIRU} Konversi Biner ke Desimal, Oktal, dan Heksadesimal       ║
    ║ {Warna.KUNING}[2]{Warna.RESET}{Warna.BIRU} Konversi Desimal ke Biner, Oktal, dan Heksadesimal       ║
    ║ {Warna.KUNING}[3]{Warna.RESET}{Warna.BIRU} Konversi Oktal ke Biner, Desimal, dan Heksadesimal       ║
    ║ {Warna.KUNING}[4]{Warna.RESET}{Warna.BIRU} Konversi Heksadesimal ke Biner, Desimal, dan Oktal       ║
    ║ {Warna.KUNING}[5]{Warna.RESET}{Warna.BIRU} Keluar                                                   ║
    ╚════════════════════════════════════════════════════════════════╝{Warna.RESET}
    '''
    
    print(menu)

def main():
    """Fungsi utama program"""
    while True:
        tampilkan_menu()
        pilihan = input(f"{Warna.CYAN}Pilih menu {Warna.KUNING}[1-5]{Warna.CYAN}: {Warna.RESET}")
        
        if pilihan == '1':
            biner_ke_lainnya()
        elif pilihan == '2':
            desimal_ke_lainnya()
        elif pilihan == '3':
            oktal_ke_lainnya()
        elif pilihan == '4':
            heksadesimal_ke_lainnya()
        elif pilihan == '5':
            clear_screen()
            tampilkan_header()
            print(f"\n{Warna.HIJAU}{Warna.BOLD}Terima kasih telah menggunakan program ini!{Warna.RESET}")
            break
        else:
            print(f"\n{Warna.MERAH}[!] Pilihan tidak valid! Silakan pilih menu 1-5.{Warna.RESET}")
            time.sleep(2)
            continue
        
        input(f"\n{Warna.CYAN}Tekan Enter untuk kembali ke menu utama...{Warna.RESET}")

if __name__ == "__main__":
    main() 