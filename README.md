# Для запуска приложения: 
1.Склонировать себе репозиторий с помощью команды:
``` git clone https://github.com/Vera-fe/test-smartLogistic.git test-smartLogistic ```
2. Зайти в папку проекта:
``` cd test-smartLogistic ```
3. Установить зависимости:
``` npm install ```
4. Запустить локально:
``` npm run dev ```


# Если приложение не запустилось проверить наличие следующих утилит:
```
node --version
git --version
npm --version
```

# Возможные проблемы и их устранение:
1. ``` npm: command not found ```
   Node.js не установлен

2. ``` permission denied ```
   Запустите терминал от имени администратора (Windows) или используйте sudo (Mac/Linux)
   
3. ``` EACCES: permission denied ``` при установке
   Очистите кэш npm: npm cache clean --force и повторите установку


### Приложение не стала выводить на хост, т.к. такого требования не было
