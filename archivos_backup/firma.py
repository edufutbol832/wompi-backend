import hashlib

# Datos requeridos
referencia = "edupago"
monto = "150000"  # $1.500 COP en centavos
moneda = "COP"
secreto = "test_integrity_CxvWC5XqHUC8eownzkyCMKjfOujwVmqk"

# Concatenación exacta
cadena_concatenada = referencia + monto + moneda + secreto

# Generar hash SHA256
hash_firma = hashlib.sha256(cadena_concatenada.encode('utf-8')).hexdigest()
print("Firma de integridad:", hash_firma)
