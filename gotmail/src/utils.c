#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include "./includes.h"

void display_ascii()
{
    printf("___  ___      _ _ _____                _          \n");
    printf("|  \\/  |     (_) /  ___|              | |         \n");
    printf("| .  . | __ _ _| \\ `--.  ___ _ __   __| | ___ _ __\n");
    printf("| |\\/| |/ _` | | |`--. \\/ _ \\ '_ \\ / _` |/ _ \\ '__|\n");
    printf("| |  | | (_| | | /\\__/ /  __/ | | | (_| |  __/ |   \n");
    printf("\\_|  |_/\\__,_|_|_\\____/ \\___|_| |_|\\__,_|\\___|_|   \n");
    printf("\n-----------------------------\n");
}

uint8_t return_menu()
{
    char choice = 0;
    printf("\n------------------------------\n");
    printf("Return to menu (y/n): ");
    choice = fgetc(stdin);
    if (choice == 'n') return 1;
    return 0;
}
