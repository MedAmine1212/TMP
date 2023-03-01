<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class InstanceMail extends Mailable
{
    use Queueable, SerializesModels;
    public $details;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($details)
    {
        $this->details=$details;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        if($this->details['forgetPassword'])
            return $this->subject($this->details['subject'])->view('emails.ForgetPassword');


        
        if($this->details['invitation'])
        return $this->subject($this->details['subject'])->view('emails.InvitationEmail');
             return $this->subject($this->details['subject'])->view('emails.TestEmail');

    }
}
