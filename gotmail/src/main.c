#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <stdint.h>
#include "./includes.h"

#define MAX_MESSAGE_LENGTH 100

typedef struct {
    char receiver[25];
    char message[100];
} Message;

void check_receiver(const char* email) {
    char user[13] = {0};
    char domain[14] = {0};

    sscanf(email, "%99[a-zA-Z0-9._-]@%99[a-zA-Z0-9.-]", user, domain);

    printf("Trying to send a message to user '%s' ...\n", user);

    if (strcmp(domain, "mindbreak.fr") != 0) {
        printf("ERROR: only the domain 'mindbreak.fr' is allowed !\n");
        exit(1);
    }
}

void send_mail(Message* msg) {
    printf("\n\nThank you for trusting our mail server !\n");

    printf("Sending the message to the following receiver :\n");
    printf(msg->receiver);
    printf("\nWith the following content :\n");
    puts(msg->message);

    free(msg);
}

int main() {
    uint8_t choice = 0;

    do {
        display_ascii();
        printf("Menu:\n1. Send a message\n0. Exit\n\nChoice: ");
        scanf("%hhd", &choice);
        if (choice == 1) {
            char receiver[25] = {0}, message[MAX_MESSAGE_LENGTH] = {0};

            printf("Enter receiver email address: ");
            scanf("%25s", (char *)&receiver);
            getchar();

            check_receiver(receiver);
            Message* msg = malloc(sizeof(Message));
            strncpy(msg->receiver, receiver, 25);

            printf("Enter the email message:\n");
            fgets(message, sizeof(char) * MAX_MESSAGE_LENGTH, stdin);
            strncpy(msg->message, message, MAX_MESSAGE_LENGTH);
            send_mail(msg);
        }
    } while (choice != 0);
    
    return 0;
}